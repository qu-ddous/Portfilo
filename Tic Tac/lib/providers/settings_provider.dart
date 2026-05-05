import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage_service.dart';

// Sound Provider
final soundEnabledProvider = StateNotifierProvider<SoundNotifier, bool>((ref) {
  return SoundNotifier();
});

class SoundNotifier extends StateNotifier<bool> {
  SoundNotifier() : super(true) {
    state = StorageService.getSoundEnabled();
  }

  Future<void> toggle() async {
    state = !state;
    await StorageService.saveSoundEnabled(state);
  }

  Future<void> set(bool enabled) async {
    state = enabled;
    await StorageService.saveSoundEnabled(enabled);
  }
}

// Haptics Provider
final hapticsEnabledProvider = StateNotifierProvider<HapticsNotifier, bool>((ref) {
  return HapticsNotifier();
});

class HapticsNotifier extends StateNotifier<bool> {
  HapticsNotifier() : super(true) {
    state = StorageService.getHapticsEnabled();
  }

  Future<void> toggle() async {
    state = !state;
    await StorageService.saveHapticsEnabled(state);
  }

  Future<void> set(bool enabled) async {
    state = enabled;
    await StorageService.saveHapticsEnabled(enabled);
  }
}

// Player Name Provider
final playerNameProvider = StateNotifierProvider<PlayerNameNotifier, String>((ref) {
  return PlayerNameNotifier();
});

class PlayerNameNotifier extends StateNotifier<String> {
  PlayerNameNotifier() : super('Player') {
    state = StorageService.getPlayerName();
  }

  Future<void> setName(String name) async {
    state = name;
    await StorageService.savePlayerName(name);
  }
}

// Grid Size Preference Provider
final gridSizePreferenceProvider = StateNotifierProvider<GridSizeNotifier, int>((ref) {
  return GridSizeNotifier();
});

class GridSizeNotifier extends StateNotifier<int> {
  GridSizeNotifier() : super(3) {
    state = StorageService.getGridSizePreference();
  }

  Future<void> setSize(int size) async {
    state = size;
    await StorageService.saveGridSizePreference(size);
  }
}
