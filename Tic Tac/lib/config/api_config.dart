class ApiConfig {
  // Base URL - Update this with your backend URL
  static const String baseUrl = 'http://localhost:3000';
  static const String apiVersion = '/api';
  
  // Full API URL
  static String get apiUrl => '$baseUrl$apiVersion';
  
  // Socket URL
  static String get socketUrl => baseUrl;
  
  // Endpoints
  static const String auth = '/auth';
  static const String games = '/games';
  static const String scores = '/scores';
  static const String rooms = '/rooms';
  static const String achievements = '/achievements';
  
  // Auth Endpoints
  static String get register => '$apiUrl$auth/register';
  static String get login => '$apiUrl$auth/login';
  static String get logout => '$apiUrl$auth/logout';
  static String get profile => '$apiUrl$auth/profile';
  
  // Game Endpoints
  static String get createGame => '$apiUrl$games/create';
  static String gameMove(String gameId) => '$apiUrl$games/$gameId/move';
  static String getGame(String gameId) => '$apiUrl$games/$gameId';
  static String forfeitGame(String gameId) => '$apiUrl$games/$gameId/forfeit';
  static String get gameHistory => '$apiUrl$games/history';
  static String get gameStats => '$apiUrl$games/stats';
  
  // Score Endpoints
  static String get leaderboard => '$apiUrl$scores/leaderboard';
  static String get saveScore => '$apiUrl$scores/save';
  static String get myScores => '$apiUrl$scores/my-scores';
  
  // Room Endpoints
  static String get createRoom => '$apiUrl$rooms/create';
  static String joinRoom(String roomCode) => '$apiUrl$rooms/$roomCode/join';
  static String get availableRooms => '$apiUrl$rooms/available';
  static String getRoom(String roomCode) => '$apiUrl$rooms/$roomCode';
  static String startRoom(String roomCode) => '$apiUrl$rooms/$roomCode/start';
  static String leaveRoom(String roomCode) => '$apiUrl$rooms/$roomCode/leave';
  
  // Achievement Endpoints
  static String get allAchievements => '$apiUrl$achievements';
  static String get checkAchievements => '$apiUrl$achievements/check';
  static String get myAchievements => '$apiUrl$achievements/my-achievements';
  
  // Timeouts
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);
}
