import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/player_model.dart';
import '../services/storage_service.dart';

final playerProvider = StateNotifierProvider<PlayerNotifier, PlayerModel?>((ref) {
  return PlayerNotifier();
});

class PlayerNotifier extends StateNotifier<PlayerModel?> {
  PlayerNotifier() : super(null) {
    _loadPlayer();
  }

  Future<void> _loadPlayer() async {
    final userId = await StorageService.getUserId();
    if (userId != null) {
      // Load player from API or local storage
      // For now, create a basic player
      state = PlayerModel(
        id: userId,
        name: StorageService.getPlayerName(),
        createdAt: DateTime.now(),
      );
    }
  }

  void setPlayer(PlayerModel player) {
    state = player;
  }

  void updatePlayer(PlayerModel player) {
    state = player;
  }

  void clearPlayer() {
    state = null;
  }

  Future<void> updateStats({
    int? totalWins,
    int? totalLosses,
    int? totalDraws,
    int? totalGames,
  }) async {
    if (state == null) return;

    state = state!.copyWith(
      totalWins: totalWins ?? state!.totalWins,
      totalLosses: totalLosses ?? state!.totalLosses,
      totalDraws: totalDraws ?? state!.totalDraws,
      totalGames: totalGames ?? state!.totalGames,
    );
  }

  Future<void> incrementWins() async {
    if (state == null) return;
    state = state!.copyWith(
      totalWins: state!.totalWins + 1,
      totalGames: state!.totalGames + 1,
    );
  }

  Future<void> incrementLosses() async {
    if (state == null) return;
    state = state!.copyWith(
      totalLosses: state!.totalLosses + 1,
      totalGames: state!.totalGames + 1,
    );
  }

  Future<void> incrementDraws() async {
    if (state == null) return;
    state = state!.copyWith(
      totalDraws: state!.totalDraws + 1,
      totalGames: state!.totalGames + 1,
    );
  }
}
