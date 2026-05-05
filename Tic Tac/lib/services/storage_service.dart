import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/constants.dart';
import '../models/game_model.dart';
import '../models/player_model.dart';
import '../models/score_model.dart';
import '../models/achievement_model.dart';
import '../models/room_model.dart';

class StorageService {
  static late Box _settingsBox;
  static late Box<GameModel> _gamesBox;
  static const _secureStorage = FlutterSecureStorage();

  static Future<void> init() async {
    // Register adapters
    if (!Hive.isAdapterRegistered(0)) {
      Hive.registerAdapter(GameModelAdapter());
    }
    if (!Hive.isAdapterRegistered(1)) {
      Hive.registerAdapter(PlayerModelAdapter());
    }
    if (!Hive.isAdapterRegistered(2)) {
      Hive.registerAdapter(ScoreModelAdapter());
    }
    if (!Hive.isAdapterRegistered(3)) {
      Hive.registerAdapter(AchievementModelAdapter());
    }
    if (!Hive.isAdapterRegistered(4)) {
      Hive.registerAdapter(RoomModelAdapter());
    }

    // Open boxes
    _settingsBox = await Hive.openBox('settings');
    _gamesBox = await Hive.openBox<GameModel>('games');
  }

  // Settings
  static Future<void> saveSetting(String key, dynamic value) async {
    await _settingsBox.put(key, value);
  }

  static T? getSetting<T>(String key, {T? defaultValue}) {
    return _settingsBox.get(key, defaultValue: defaultValue) as T?;
  }

  static Future<void> deleteSetting(String key) async {
    await _settingsBox.delete(key);
  }

  // Theme Mode
  static Future<void> saveThemeMode(String mode) async {
    await saveSetting(AppConstants.keyThemeMode, mode);
  }

  static String getThemeMode() {
    return getSetting<String>(AppConstants.keyThemeMode, defaultValue: 'dark') ?? 'dark';
  }

  // Sound
  static Future<void> saveSoundEnabled(bool enabled) async {
    await saveSetting(AppConstants.keySoundEnabled, enabled);
  }

  static bool getSoundEnabled() {
    return getSetting<bool>(AppConstants.keySoundEnabled, defaultValue: true) ?? true;
  }

  // Haptics
  static Future<void> saveHapticsEnabled(bool enabled) async {
    await saveSetting(AppConstants.keyHapticsEnabled, enabled);
  }

  static bool getHapticsEnabled() {
    return getSetting<bool>(AppConstants.keyHapticsEnabled, defaultValue: true) ?? true;
  }

  // Player Name
  static Future<void> savePlayerName(String name) async {
    await saveSetting(AppConstants.keyPlayerName, name);
  }

  static String getPlayerName() {
    return getSetting<String>(AppConstants.keyPlayerName, defaultValue: 'Player') ?? 'Player';
  }

  // Grid Size Preference
  static Future<void> saveGridSizePreference(int size) async {
    await saveSetting(AppConstants.keyGridSizePreference, size);
  }

  static int getGridSizePreference() {
    return getSetting<int>(AppConstants.keyGridSizePreference, defaultValue: 3) ?? 3;
  }

  // Secure Storage (for tokens)
  static Future<void> saveAuthToken(String token) async {
    await _secureStorage.write(key: AppConstants.keyAuthToken, value: token);
  }

  static Future<String?> getAuthToken() async {
    return await _secureStorage.read(key: AppConstants.keyAuthToken);
  }

  static Future<void> deleteAuthToken() async {
    await _secureStorage.delete(key: AppConstants.keyAuthToken);
  }

  static Future<void> saveUserId(String userId) async {
    await _secureStorage.write(key: AppConstants.keyUserId, value: userId);
  }

  static Future<String?> getUserId() async {
    return await _secureStorage.read(key: AppConstants.keyUserId);
  }

  static Future<void> deleteUserId() async {
    await _secureStorage.delete(key: AppConstants.keyUserId);
  }

  // Game History
  static Future<void> saveGame(GameModel game) async {
    await _gamesBox.put(game.id, game);
  }

  static List<GameModel> getGameHistory({int limit = 50}) {
    final games = _gamesBox.values.toList();
    games.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return games.take(limit).toList();
  }

  static Future<void> clearGameHistory() async {
    await _gamesBox.clear();
  }

  // Clear all data
  static Future<void> clearAll() async {
    await _settingsBox.clear();
    await _gamesBox.clear();
    await deleteAuthToken();
    await deleteUserId();
  }
}
