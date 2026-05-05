import 'package:vibration/vibration.dart';
import 'storage_service.dart';

class HapticsService {
  static Future<void> light() async {
    if (!StorageService.getHapticsEnabled()) return;
    final hasVibrator = await Vibration.hasVibrator() ?? false;
    if (hasVibrator) {
      await Vibration.vibrate(duration: 10);
    }
  }

  static Future<void> medium() async {
    if (!StorageService.getHapticsEnabled()) return;
    final hasVibrator = await Vibration.hasVibrator() ?? false;
    if (hasVibrator) {
      await Vibration.vibrate(duration: 20);
    }
  }

  static Future<void> heavy() async {
    if (!StorageService.getHapticsEnabled()) return;
    final hasVibrator = await Vibration.hasVibrator() ?? false;
    if (hasVibrator) {
      await Vibration.vibrate(duration: 50);
    }
  }

  static Future<void> success() async {
    if (!StorageService.getHapticsEnabled()) return;
    final hasVibrator = await Vibration.hasVibrator() ?? false;
    if (hasVibrator) {
      await Vibration.vibrate(duration: 100, pattern: [0, 50, 50, 50]);
    }
  }

  static Future<void> error() async {
    if (!StorageService.getHapticsEnabled()) return;
    final hasVibrator = await Vibration.hasVibrator() ?? false;
    if (hasVibrator) {
      await Vibration.vibrate(duration: 200, pattern: [0, 100, 100, 100]);
    }
  }
}
