import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'storage_service.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: ApiConfig.apiUrl,
      connectTimeout: ApiConfig.connectTimeout,
      receiveTimeout: ApiConfig.receiveTimeout,
      sendTimeout: ApiConfig.sendTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  static Future<void> init() async {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token if available
          final token = await StorageService.getAuthToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) {
          // Handle errors globally
          return handler.next(error);
        },
      ),
    );
  }

  // Auth
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.register,
        data: {'name': name, 'email': email, 'password': password},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.login,
        data: {'email': email, 'password': password},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> logout() async {
    try {
      await _dio.post(ApiConfig.logout);
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await _dio.get(ApiConfig.profile);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? avatar,
  }) async {
    try {
      final response = await _dio.put(
        ApiConfig.profile,
        data: {'name': name, 'avatar': avatar},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Games
  static Future<Map<String, dynamic>> createGame({
    required String gameMode,
    required int gridSize,
    String? aiDifficulty,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.createGame,
        data: {
          'gameMode': gameMode,
          'gridSize': gridSize,
          'aiDifficulty': aiDifficulty,
        },
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> makeMove({
    required String gameId,
    required int row,
    required int col,
    required String player,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.gameMove(gameId),
        data: {'row': row, 'col': col, 'player': player},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> getGame(String gameId) async {
    try {
      final response = await _dio.get(ApiConfig.getGame(gameId));
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> forfeitGame(String gameId) async {
    try {
      await _dio.post(ApiConfig.forfeitGame(gameId));
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<dynamic>> getGameHistory({
    int limit = 50,
    int offset = 0,
  }) async {
    try {
      final response = await _dio.get(
        ApiConfig.gameHistory,
        queryParameters: {'limit': limit, 'offset': offset},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> getGameStats() async {
    try {
      final response = await _dio.get(ApiConfig.gameStats);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Scores
  static Future<List<dynamic>> getLeaderboard({
    int limit = 50,
    int offset = 0,
    int? gridSize,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'limit': limit,
        'offset': offset,
      };
      if (gridSize != null) {
        queryParams['gridSize'] = gridSize;
      }
      
      final response = await _dio.get(
        ApiConfig.leaderboard,
        queryParameters: queryParams,
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> saveScore({
    required String gameId,
    required String opponent,
    required String result,
    required int gridSize,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.saveScore,
        data: {
          'gameId': gameId,
          'opponent': opponent,
          'result': result,
          'gridSize': gridSize,
        },
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Rooms
  static Future<Map<String, dynamic>> createRoom({
    required String roomName,
    required int gridSize,
  }) async {
    try {
      final response = await _dio.post(
        ApiConfig.createRoom,
        data: {'roomName': roomName, 'gridSize': gridSize},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> joinRoom(String roomCode) async {
    try {
      final response = await _dio.post(ApiConfig.joinRoom(roomCode));
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<dynamic>> getAvailableRooms({int? gridSize}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (gridSize != null) {
        queryParams['gridSize'] = gridSize;
      }
      
      final response = await _dio.get(
        ApiConfig.availableRooms,
        queryParameters: queryParams,
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> getRoom(String roomCode) async {
    try {
      final response = await _dio.get(ApiConfig.getRoom(roomCode));
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> leaveRoom(String roomCode) async {
    try {
      await _dio.post(ApiConfig.leaveRoom(roomCode));
    } catch (e) {
      rethrow;
    }
  }

  // Achievements
  static Future<List<dynamic>> getAllAchievements() async {
    try {
      final response = await _dio.get(ApiConfig.allAchievements);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<dynamic>> checkAchievements(String gameId) async {
    try {
      final response = await _dio.post(
        ApiConfig.checkAchievements,
        data: {'gameId': gameId},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<dynamic>> getMyAchievements() async {
    try {
      final response = await _dio.get(ApiConfig.myAchievements);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
