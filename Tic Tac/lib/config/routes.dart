import 'package:flutter/material.dart';
import '../screens/splash_screen.dart';
import '../screens/home_screen.dart';
import '../screens/ai_difficulty_screen.dart';
import '../screens/game_screen.dart';
import '../screens/online_lobby_screen.dart';
import '../screens/game_result_screen.dart';
import '../screens/leaderboard_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/achievements_screen.dart';
import '../screens/profile_screen.dart';
import '../models/game_model.dart';

class AppRoutes {
  static const String splash = '/';
  static const String home = '/home';
  static const String aiDifficulty = '/ai-difficulty';
  static const String game = '/game';
  static const String onlineLobby = '/online-lobby';
  static const String gameResult = '/game-result';
  static const String leaderboard = '/leaderboard';
  static const String settings = '/settings';
  static const String achievements = '/achievements';
  static const String profile = '/profile';

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      
      case '/home':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      
      case '/ai-difficulty':
        return MaterialPageRoute(builder: (_) => const AIDifficultyScreen());
      
      case '/game':
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => GameScreen(
            gameMode: args?['gameMode'] ?? 'pvp',
            gridSize: args?['gridSize'] ?? 3,
            aiDifficulty: args?['aiDifficulty'],
            roomCode: args?['roomCode'],
          ),
        );
      
      case '/online-lobby':
        return MaterialPageRoute(builder: (_) => const OnlineLobbyScreen());
      
      case '/game-result':
        final args = settings.arguments as Map<String, dynamic>;
        return MaterialPageRoute(
          builder: (_) => GameResultScreen(
            game: args['game'] as GameModel,
            isWinner: args['isWinner'] as bool,
          ),
        );
      
      case '/leaderboard':
        return MaterialPageRoute(builder: (_) => const LeaderboardScreen());
      
      case '/settings':
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      
      case '/achievements':
        return MaterialPageRoute(builder: (_) => const AchievementsScreen());
      
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('Route ${settings.name} not found'),
            ),
          ),
        );
    }
  }
}
