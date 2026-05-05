import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage_service.dart';

final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>((ref) {
  return ThemeModeNotifier();
});

class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  ThemeModeNotifier() : super(ThemeMode.dark) {
    _loadThemeMode();
  }

  void _loadThemeMode() {
    final savedMode = StorageService.getThemeMode();
    state = savedMode == 'light' ? ThemeMode.light : ThemeMode.dark;
  }

  Future<void> toggleTheme() async {
    state = state == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    await StorageService.saveThemeMode(state == ThemeMode.light ? 'light' : 'dark');
  }

  Future<void> setTheme(ThemeMode mode) async {
    state = mode;
    await StorageService.saveThemeMode(mode == ThemeMode.light ? 'light' : 'dark');
  }
}
