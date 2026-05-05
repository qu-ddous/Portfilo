import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart' show kIsWeb, kDebugMode, debugPrint;
import 'storage_service.dart';

class AudioService {
  static final Map<String, AudioPlayer> _players = {};
  static bool _isInitialized = false;
  static bool _soundsAvailable = true;

  static Future<void> init() async {
    if (_isInitialized) return;
    
    // Create separate players for each sound for better performance
    _players['move'] = AudioPlayer();
    _players['win'] = AudioPlayer();
    _players['lose'] = AudioPlayer();
    _players['draw'] = AudioPlayer();
    _players['click'] = AudioPlayer();

    // Set release mode for all players
    for (var player in _players.values) {
      await player.setReleaseMode(ReleaseMode.stop);
      if (kIsWeb) {
        // For web, set lower volume to avoid distortion
        await player.setVolume(0.5);
      }
    }

    _isInitialized = true;
  }

  static Future<void> _playSound(String soundName) async {
    if (!StorageService.getSoundEnabled()) return;
    if (!_soundsAvailable) return;

    try {
      final player = _players[soundName];
      if (player == null) return;

      // Stop any currently playing sound on this player
      await player.stop();

      // Try to play the sound
      if (kIsWeb) {
        // For web, use a simpler approach
        await player.play(
          AssetSource('sounds/$soundName.mp3'),
          volume: 0.5,
        );
      } else {
        await player.play(AssetSource('sounds/$soundName.mp3'));
      }
    } catch (e) {
      // If sound fails, disable future attempts to avoid spam
      _soundsAvailable = false;
      if (kIsWeb) {
        // On web, audio might not be available, silently ignore
        return;
      }
      // On other platforms, log the error in debug mode only
      if (kDebugMode) {
        debugPrint('Audio error for $soundName: $e');
      }
    }
  }

  static Future<void> playMove() async {
    await _playSound('move');
  }

  static Future<void> playWin() async {
    await _playSound('win');
  }

  static Future<void> playDraw() async {
    await _playSound('draw');
  }

  static Future<void> playLose() async {
    await _playSound('lose');
  }

  static Future<void> playClick() async {
    await _playSound('click');
  }

  static Future<void> dispose() async {
    for (var player in _players.values) {
      await player.dispose();
    }
    _players.clear();
  }

  // Method to re-enable sounds if user wants to try again
  static void enableSounds() {
    _soundsAvailable = true;
  }

  // Method to check if sounds are available
  static bool get areSoundsAvailable => _soundsAvailable;
}
