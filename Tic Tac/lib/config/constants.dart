class AppConstants {
  // App Info
  static const String appName = 'Tic Tac Pro';
  static const String appVersion = '1.0.0';
  
  // Colors
  static const int primaryColor = 0xFF6366F1;
  static const int primaryDarkColor = 0xFF4F46E5;
  static const int accentRedColor = 0xFFEF4444;
  static const int accentGreenColor = 0xFF22C55E;
  static const int backgroundDarkColor = 0xFF0F172A;
  static const int backgroundLightColor = 0xFFFAFAFA;
  static const int textPrimaryDarkColor = 0xFF1A1A1A;
  static const int textWhiteColor = 0xFFFFFFFF;
  static const int borderColor = 0xFFE5E7EB;
  
  // Spacing
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 12.0;
  static const double spacingLg = 16.0;
  static const double spacingXl = 24.0;
  static const double spacingXxl = 32.0;
  static const double spacingXxxl = 48.0;
  
  // Border Radius
  static const double radiusSm = 4.0;
  static const double radiusMd = 8.0;
  static const double radiusLg = 12.0;
  static const double radiusXl = 16.0;
  static const double radiusFull = 999.0;
  
  // Typography Sizes
  static const double fontH1 = 36.0;
  static const double fontH2 = 28.0;
  static const double fontH3 = 20.0;
  static const double fontBodyLarge = 16.0;
  static const double fontBody = 14.0;
  static const double fontBodySmall = 12.0;
  static const double fontCaption = 11.0;
  
  // Game Settings
  static const int defaultGridSize = 3;
  static const int minGridSize = 3;
  static const int maxGridSize = 5;
  static const Duration aiMoveDelay = Duration(milliseconds: 500);
  static const Duration animationDuration = Duration(milliseconds: 300);
  
  // Storage Keys
  static const String keyThemeMode = 'theme_mode';
  static const String keySoundEnabled = 'sound_enabled';
  static const String keyHapticsEnabled = 'haptics_enabled';
  static const String keyPlayerName = 'player_name';
  static const String keyAuthToken = 'auth_token';
  static const String keyUserId = 'user_id';
  static const String keyGameHistory = 'game_history';
  static const String keyGridSizePreference = 'grid_size_preference';
  
  // Game Modes
  static const String gameModeAI = 'pva';
  static const String gameModeLocal = 'pvp';
  static const String gameModeOnline = 'online';
  
  // AI Difficulty
  static const String aiEasy = 'easy';
  static const String aiMedium = 'medium';
  static const String aiHard = 'hard';
  
  // Player Symbols
  static const String playerX = 'X';
  static const String playerO = 'O';
  
  // Game Status
  static const String statusPlaying = 'playing';
  static const String statusWon = 'won';
  static const String statusDraw = 'draw';
  static const String statusForfeited = 'forfeited';
  
  // Achievements
  static const List<Map<String, String>> achievements = [
    {
      'id': 'first_win',
      'name': 'First Victory',
      'description': 'Win your first game',
      'icon': '🏆',
    },
    {
      'id': 'win_streak_3',
      'name': 'Hat Trick',
      'description': 'Win 3 games in a row',
      'icon': '🔥',
    },
    {
      'id': 'win_streak_5',
      'name': 'Unstoppable',
      'description': 'Win 5 games in a row',
      'icon': '⚡',
    },
    {
      'id': 'beat_hard_ai',
      'name': 'AI Master',
      'description': 'Beat the Hard AI',
      'icon': '🤖',
    },
    {
      'id': 'total_wins_10',
      'name': 'Veteran',
      'description': 'Win 10 games total',
      'icon': '🎖️',
    },
    {
      'id': 'total_wins_50',
      'name': 'Champion',
      'description': 'Win 50 games total',
      'icon': '👑',
    },
    {
      'id': 'total_wins_100',
      'name': 'Legend',
      'description': 'Win 100 games total',
      'icon': '🌟',
    },
    {
      'id': 'perfect_game',
      'name': 'Flawless',
      'description': 'Win without opponent scoring',
      'icon': '💎',
    },
  ];
}
