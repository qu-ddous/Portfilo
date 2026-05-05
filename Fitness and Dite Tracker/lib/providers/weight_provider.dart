import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/dio_client.dart';

class WeightState {
  final List<dynamic> history;
  final Map<String, dynamic>? statistics;
  final bool isLoading;

  WeightState({this.history = const [], this.statistics, this.isLoading = false});

  WeightState copyWith({List<dynamic>? history, Map<String, dynamic>? statistics, bool? isLoading}) {
    return WeightState(
      history: history ?? this.history,
      statistics: statistics ?? this.statistics,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class WeightNotifier extends StateNotifier<WeightState> {
  WeightNotifier() : super(WeightState());
  bool _isSaving = false;

  Future<void> fetchHistory({int days = 30}) async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/weight/history?days=$days');
      if (response.statusCode == 200) {
        state = state.copyWith(
          history: response.data['weight_history'],
          statistics: response.data['statistics'],
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<bool> logWeight(double weight, String? notes) async {
    if (_isSaving) return false;
    _isSaving = true;
    try {
      final dio = DioClient().dio;
      final response = await dio.post('/user/weight/log', data: {
        'weight_kg': weight,
        'notes': notes,
        'logged_date': DateTime.now().toIso8601String(),
      });
      if (response.statusCode == 201) {
        await fetchHistory();
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

final weightProvider = StateNotifierProvider<WeightNotifier, WeightState>((ref) {
  return WeightNotifier();
});
