import 'package:uuid/uuid.dart';
import '../models/game_model.dart';
import '../config/constants.dart';

class GameService {
  static const _uuid = Uuid();

  // Create a new game
  static GameModel createGame({
    required String gameMode,
    required int gridSize,
    String? aiDifficulty,
    String? playerXId,
    String? playerOId,
    String? playerXName,
    String? playerOName,
  }) {
    final board = List.generate(
      gridSize,
      (_) => List.generate(gridSize, (_) => ''),
    );

    return GameModel(
      id: _uuid.v4(),
      gameMode: gameMode,
      gridSize: gridSize,
      status: AppConstants.statusPlaying,
      board: board,
      currentPlayer: AppConstants.playerX,
      aiDifficulty: aiDifficulty,
      playerXId: playerXId,
      playerOId: playerOId,
      playerXName: playerXName ?? 'Player X',
      playerOName: playerOName ?? (gameMode == AppConstants.gameModeAI ? 'AI' : 'Player O'),
      createdAt: DateTime.now(),
      moveCount: 0,
    );
  }

  // Make a move
  static GameModel makeMove(GameModel game, int row, int col) {
    // Validate move
    if (!isValidMove(game, row, col)) {
      throw Exception('Invalid move');
    }

    // Create new board with the move
    final newBoard = game.board.map((r) => List<String>.from(r)).toList();
    newBoard[row][col] = game.currentPlayer;

    // Check for winner
    final winner = checkWinner(newBoard, game.gridSize);
    final winningLine = winner != null ? getWinningLine(newBoard, game.gridSize) : null;

    // Check for draw
    final isDraw = winner == null && isBoardFull(newBoard);

    // Determine new status
    String newStatus = game.status;
    if (winner != null) {
      newStatus = AppConstants.statusWon;
    } else if (isDraw) {
      newStatus = AppConstants.statusDraw;
    }

    // Switch player
    final nextPlayer = game.currentPlayer == AppConstants.playerX
        ? AppConstants.playerO
        : AppConstants.playerX;

    return game.copyWith(
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: winner,
      winningLine: winningLine,
      status: newStatus,
      endedAt: newStatus != AppConstants.statusPlaying ? DateTime.now() : null,
      moveCount: game.moveCount + 1,
    );
  }

  // Check if move is valid
  static bool isValidMove(GameModel game, int row, int col) {
    if (game.status != AppConstants.statusPlaying) return false;
    if (row < 0 || row >= game.gridSize) return false;
    if (col < 0 || col >= game.gridSize) return false;
    return game.board[row][col].isEmpty;
  }

  // Check for winner
  static String? checkWinner(List<List<String>> board, int gridSize) {
    // Check rows
    for (int i = 0; i < gridSize; i++) {
      if (board[i][0].isNotEmpty &&
          board[i].every((cell) => cell == board[i][0])) {
        return board[i][0];
      }
    }

    // Check columns
    for (int j = 0; j < gridSize; j++) {
      if (board[0][j].isNotEmpty &&
          List.generate(gridSize, (i) => board[i][j])
              .every((cell) => cell == board[0][j])) {
        return board[0][j];
      }
    }

    // Check main diagonal
    if (board[0][0].isNotEmpty &&
        List.generate(gridSize, (i) => board[i][i])
            .every((cell) => cell == board[0][0])) {
      return board[0][0];
    }

    // Check anti-diagonal
    if (board[0][gridSize - 1].isNotEmpty &&
        List.generate(gridSize, (i) => board[i][gridSize - 1 - i])
            .every((cell) => cell == board[0][gridSize - 1])) {
      return board[0][gridSize - 1];
    }

    return null;
  }

  // Get winning line indices
  static List<int>? getWinningLine(List<List<String>> board, int gridSize) {
    // Check rows
    for (int i = 0; i < gridSize; i++) {
      if (board[i][0].isNotEmpty &&
          board[i].every((cell) => cell == board[i][0])) {
        return List.generate(gridSize, (j) => i * gridSize + j);
      }
    }

    // Check columns
    for (int j = 0; j < gridSize; j++) {
      if (board[0][j].isNotEmpty &&
          List.generate(gridSize, (i) => board[i][j])
              .every((cell) => cell == board[0][j])) {
        return List.generate(gridSize, (i) => i * gridSize + j);
      }
    }

    // Check main diagonal
    if (board[0][0].isNotEmpty &&
        List.generate(gridSize, (i) => board[i][i])
            .every((cell) => cell == board[0][0])) {
      return List.generate(gridSize, (i) => i * gridSize + i);
    }

    // Check anti-diagonal
    if (board[0][gridSize - 1].isNotEmpty &&
        List.generate(gridSize, (i) => board[i][gridSize - 1 - i])
            .every((cell) => cell == board[0][gridSize - 1])) {
      return List.generate(gridSize, (i) => i * gridSize + (gridSize - 1 - i));
    }

    return null;
  }

  // Check if board is full
  static bool isBoardFull(List<List<String>> board) {
    return board.every((row) => row.every((cell) => cell.isNotEmpty));
  }

  // Get available moves
  static List<Map<String, int>> getAvailableMoves(List<List<String>> board) {
    final moves = <Map<String, int>>[];
    for (int i = 0; i < board.length; i++) {
      for (int j = 0; j < board[i].length; j++) {
        if (board[i][j].isEmpty) {
          moves.add({'row': i, 'col': j});
        }
      }
    }
    return moves;
  }

  // Reset game
  static GameModel resetGame(GameModel game) {
    return createGame(
      gameMode: game.gameMode,
      gridSize: game.gridSize,
      aiDifficulty: game.aiDifficulty,
      playerXId: game.playerXId,
      playerOId: game.playerOId,
      playerXName: game.playerXName,
      playerOName: game.playerOName,
    );
  }

  // Forfeit game
  static GameModel forfeitGame(GameModel game, String forfeitingPlayer) {
    final winner = forfeitingPlayer == AppConstants.playerX
        ? AppConstants.playerO
        : AppConstants.playerX;

    return game.copyWith(
      status: AppConstants.statusForfeited,
      winner: winner,
      endedAt: DateTime.now(),
    );
  }
}
