import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../config/dio_client.dart';

class FoodScannerService {
  final Dio _dio = DioClient().dio;

  /// Search for food by barcode or QR code ID
  /// This uses the USDA API indirectly via our backend search
  Future<Map<String, dynamic>?> scanAndGetNutrition(String code) async {
    try {
      final response = await _dio.get('/admin/meals/nutrition/search', queryParameters: {'q': code});
      if (response.data['success'] && response.data['results'].isNotEmpty) {
        return response.data['results'][0];
      }
    } catch (e) {
      debugPrint('Scanner Error: $e');
    }
    return null;
  }
}
