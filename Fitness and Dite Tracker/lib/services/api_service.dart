import 'package:dio/dio.dart';
import '../config/dio_client.dart';
import '../models/user_model.dart';
import '../config/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final Dio _dio = DioClient().dio;

  // Generic methods
  Future<dynamic> get(String path) async {
    try {
      final response = await _dio.get(path);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<dynamic> post(String path, dynamic data) async {
    try {
      final response = await _dio.post(path, data: data);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<dynamic> put(String path, dynamic data) async {
    try {
      final response = await _dio.put(path, data: data);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  Future<dynamic> delete(String path) async {
    try {
      final response = await _dio.delete(path);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}

class AuthService {
  final Dio _dio = DioClient().dio;
  final _storage = const FlutterSecureStorage();

  Future<UserModel?> login(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        final data = response.data;
        await _storage.write(key: AppConstants.tokenKey, value: data['tokens']['accessToken']);
        await _storage.write(key: AppConstants.refreshTokenKey, value: data['tokens']['refreshToken']);
        return UserModel.fromJson(data['user']);
      }
    } catch (e) {
      rethrow;
    }
    return null;
  }

  Future<bool> register(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/auth/register', data: data);
      return response.statusCode == 201;
    } catch (e) {
      rethrow;
    }
  }

  Future<UserModel?> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/auth/profile', data: data);
      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['user']);
      }
    } catch (e) {
      rethrow;
    }
    return null;
  }

  /// Fetch current user profile using stored token (for auto-login on restart)
  Future<UserModel?> getMe() async {
    try {
      final token = await _storage.read(key: AppConstants.tokenKey);
      if (token == null) return null;
      final response = await _dio.get('/auth/me');
      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['user']);
      }
    } catch (_) {
      // Token expired or invalid — stay logged out
    }
    return null;
  }

  Future<void> logout() async {
    await _storage.delete(key: AppConstants.tokenKey);
    await _storage.delete(key: AppConstants.refreshTokenKey);
  }
}
