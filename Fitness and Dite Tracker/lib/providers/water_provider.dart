import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/dio_client.dart';

class WaterState {
  final int totalMl;
  final int goalMl;
  final bool isLoading;

  WaterState({this.totalMl = 0, this.goalMl = 2500, this.isLoading = false});

  WaterState copyWith({int? totalMl, int? goalMl, bool? isLoading}) {
    return WaterState(
      totalMl: totalMl ?? this.totalMl,
      goalMl: goalMl ?? this.goalMl,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class WaterNotifier extends StateNotifier<WaterState> {
  WaterNotifier() : super(WaterState());
  bool _isSaving = false;

  Future<void> fetchToday() async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/water/today');
      if (response.statusCode == 200) {
        state = state.copyWith(
          totalMl: response.data['total_ml'],
          goalMl: response.data['goal_ml'],
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<bool> logWater(int amount) async {
    if (_isSaving) return false;
    _isSaving = true;
    try {
      final dio = DioClient().dio;
      final response = await dio.post('/user/water/log', data: {'amount_ml': amount});
      if (response.statusCode == 201) {
        await fetchToday();
        return true;
      }
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      _isSaving = false;
    }
    return false;
  }
}

final waterProvider = StateNotifierProvider<WaterNotifier, WaterState>((ref) {
  return WaterNotifier();
});
