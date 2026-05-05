import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/game_model.dart';
import '../services/game_service.dart';
import '../services/ai_service.dart';
import '../services/storage_service.dart';
import '../config/constants.dart';

final gameProvider = StateNotifierProvider<GameNotifier, GameModel?>((ref) {
  return GameNotifier();
});

class GameNotifier extends StateNotifier<GameModel?> {
  GameNotifier() : super(null);

  void createGame({
    required String gameMode,
    required int gridSize,
    String? aiDifficulty,
    String? playerXName,
    String? playerOName,
  }) {
    state = GameService.createGame(
      gameMode: gameMode,
      gridSize: gridSize,
      aiDifficulty: aiDifficulty,
      playerXName: playerXName,
      playerOName: playerOName,
    );
  }

  Future<void> makeMove(int row, int col) async {
    if (state == null) return;

    try {
      // Make the move
      final updatedGame = GameService.makeMove(state!, row, col);
      state = updatedGame;

      // Save game if it's over
      if (updatedGame.isGameOver) {
        await StorageService.saveGame(updatedGame);
      }

      // If it's AI mode and game is still playing, make AI move
      if (updatedGame.gameMode == AppConstants.gameModeAI &&
          !updatedGame.isGameOver &&
          updatedGame.currentPlayer == AppConstants.playerO) {
        await Future.delayed(AppConstants.aiMoveDelay);
        await _makeAIMove();
      }
    } catch (e) {
      // Invalid move, ignore
    }
  }

  Future<void> _makeAIMove() async {
    if (state == null || state!.aiDifficulty == null) return;

    try {
      final aiMove = AIService.getAIMove(
        state!.board,
        state!.aiDifficulty!,
        AppConstants.playerO,
      );

      final updatedGame = GameService.makeMove(
        state!,
        aiMove['row']!,
        aiMove['col']!,
      );

      state = updatedGame;

      // Save game if it's over
      if (updatedGame.isGameOver) {
        await StorageService.saveGame(updatedGame);
      }
    } catch (e) {
      // Error making AI move
    }
  }

  void resetGame() {
    if (state == null) return;
    state = GameService.resetGame(state!);
  }

  void forfeitGame(String forfeitingPlayer) {
    if (state == null) return;
    state = GameService.forfeitGame(state!, forfeitingPlayer);
  }

  void clearGame() {
    state = null;
  }

  void setGame(GameModel game) {
    state = game;
  }
}
