import 'dart:math';
import '../config/constants.dart';
import 'game_service.dart';

class AIService {
  static final _random = Random();

  // Get AI move based on difficulty
  static Map<String, int> getAIMove(
    List<List<String>> board,
    String difficulty,
    String aiPlayer,
  ) {
    switch (difficulty) {
      case AppConstants.aiEasy:
        return _getRandomMove(board);
      case AppConstants.aiMedium:
        return _getMediumMove(board, aiPlayer);
      case AppConstants.aiHard:
        return _getHardMove(board, aiPlayer);
      default:
        return _getRandomMove(board);
    }
  }

  // Easy: Random move
  static Map<String, int> _getRandomMove(List<List<String>> board) {
    final availableMoves = GameService.getAvailableMoves(board);
    if (availableMoves.isEmpty) {
      throw Exception('No available moves');
    }
    return availableMoves[_random.nextInt(availableMoves.length)];
  }

  // Medium: Try to win, block opponent, or random
  static Map<String, int> _getMediumMove(
    List<List<String>> board,
    String aiPlayer,
  ) {
    final opponent = aiPlayer == AppConstants.playerX
        ? AppConstants.playerO
        : AppConstants.playerX;

    // Try to win
    final winMove = _findWinningMove(board, aiPlayer);
    if (winMove != null) return winMove;

    // Block opponent's winning move
    final blockMove = _findWinningMove(board, opponent);
    if (blockMove != null) return blockMove;

    // Random move
    return _getRandomMove(board);
  }

  // Hard: Minimax algorithm with grid-size adaptive depth
  static Map<String, int> _getHardMove(
    List<List<String>> board,
    String aiPlayer,
  ) {
    final gridSize = board.length;
    final opponent = aiPlayer == AppConstants.playerX
        ? AppConstants.playerO
        : AppConstants.playerX;

    // For larger grids (4x4, 5x5), use smarter strategy instead of full minimax
    if (gridSize >= 4) {
      return _getSmartMove(board, aiPlayer);
    }

    // For 3x3, use full minimax
    int bestScore = -1000;
    Map<String, int>? bestMove;

    final availableMoves = GameService.getAvailableMoves(board);

    for (final move in availableMoves) {
      // Make move
      final newBoard = board.map((row) => List<String>.from(row)).toList();
      newBoard[move['row']!][move['col']!] = aiPlayer;

      // Calculate score
      final score = _minimax(newBoard, 0, false, aiPlayer, opponent, gridSize);

      // Update best move
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove ?? _getRandomMove(board);
  }

  // Smart move for larger grids (4x4, 5x5)
  static Map<String, int> _getSmartMove(
    List<List<String>> board,
    String aiPlayer,
  ) {
    final opponent = aiPlayer == AppConstants.playerX
        ? AppConstants.playerO
        : AppConstants.playerX;

    // 1. Try to win
    final winMove = _findWinningMove(board, aiPlayer);
    if (winMove != null) return winMove;

    // 2. Block opponent's winning move
    final blockMove = _findWinningMove(board, opponent);
    if (blockMove != null) return blockMove;

    // 3. Try to create a threat (two in a row)
    final threatMove = _findThreatMove(board, aiPlayer);
    if (threatMove != null) return threatMove;

    // 4. Block opponent's threat
    final blockThreatMove = _findThreatMove(board, opponent);
    if (blockThreatMove != null) return blockThreatMove;

    // 5. Take center if available
    final gridSize = board.length;
    final center = gridSize ~/ 2;
    if (board[center][center].isEmpty) {
      return {'row': center, 'col': center};
    }

    // 6. Take corners
    final corners = [
      {'row': 0, 'col': 0},
      {'row': 0, 'col': gridSize - 1},
      {'row': gridSize - 1, 'col': 0},
      {'row': gridSize - 1, 'col': gridSize - 1},
    ];
    
    for (final corner in corners) {
      if (board[corner['row']!][corner['col']!].isEmpty) {
        return corner;
      }
    }

    // 7. Random move
    return _getRandomMove(board);
  }

  // Find move that creates a threat (two in a row with empty third)
  static Map<String, int>? _findThreatMove(
    List<List<String>> board,
    String player,
  ) {
    final availableMoves = GameService.getAvailableMoves(board);
    
    for (final move in availableMoves) {
      final newBoard = board.map((row) => List<String>.from(row)).toList();
      newBoard[move['row']!][move['col']!] = player;
      
      // Check if this creates a line with 2 pieces
      if (_hasTwoInLine(newBoard, player, move['row']!, move['col']!)) {
        return move;
      }
    }
    
    return null;
  }

  // Check if a position creates two in a line
  static bool _hasTwoInLine(
    List<List<String>> board,
    String player,
    int row,
    int col,
  ) {
    final gridSize = board.length;
    
    // Check row
    int rowCount = 0;
    for (int j = 0; j < gridSize; j++) {
      if (board[row][j] == player) rowCount++;
    }
    if (rowCount >= 2) return true;
    
    // Check column
    int colCount = 0;
    for (int i = 0; i < gridSize; i++) {
      if (board[i][col] == player) colCount++;
    }
    if (colCount >= 2) return true;
    
    // Check main diagonal
    if (row == col) {
      int diagCount = 0;
      for (int i = 0; i < gridSize; i++) {
        if (board[i][i] == player) diagCount++;
      }
      if (diagCount >= 2) return true;
    }
    
    // Check anti-diagonal
    if (row + col == gridSize - 1) {
      int antiDiagCount = 0;
      for (int i = 0; i < gridSize; i++) {
        if (board[i][gridSize - 1 - i] == player) antiDiagCount++;
      }
      if (antiDiagCount >= 2) return true;
    }
    
    return false;
  }

  // Minimax algorithm (optimized for 3x3)
  static int _minimax(
    List<List<String>> board,
    int depth,
    bool isMaximizing,
    String aiPlayer,
    String opponent,
    int gridSize,
  ) {
    final winner = GameService.checkWinner(board, gridSize);

    // Terminal states
    if (winner == aiPlayer) return 10 - depth;
    if (winner == opponent) return depth - 10;
    if (GameService.isBoardFull(board)) return 0;

    // Depth limit for performance
    if (depth >= 4) return 0;

    if (isMaximizing) {
      int bestScore = -1000;
      final availableMoves = GameService.getAvailableMoves(board);

      for (final move in availableMoves) {
        final newBoard = board.map((row) => List<String>.from(row)).toList();
        newBoard[move['row']!][move['col']!] = aiPlayer;

        final score = _minimax(newBoard, depth + 1, false, aiPlayer, opponent, gridSize);
        bestScore = max(bestScore, score);
      }

      return bestScore;
    } else {
      int bestScore = 1000;
      final availableMoves = GameService.getAvailableMoves(board);

      for (final move in availableMoves) {
        final newBoard = board.map((row) => List<String>.from(row)).toList();
        newBoard[move['row']!][move['col']!] = opponent;

        final score = _minimax(newBoard, depth + 1, true, aiPlayer, opponent, gridSize);
        bestScore = min(bestScore, score);
      }

      return bestScore;
    }
  }

  // Find winning move for a player
  static Map<String, int>? _findWinningMove(
    List<List<String>> board,
    String player,
  ) {
    final availableMoves = GameService.getAvailableMoves(board);

    for (final move in availableMoves) {
      final newBoard = board.map((row) => List<String>.from(row)).toList();
      newBoard[move['row']!][move['col']!] = player;

      if (GameService.checkWinner(newBoard, board.length) == player) {
        return move;
      }
    }

    return null;
  }
}
