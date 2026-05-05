import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/dio_client.dart';
import '../services/food_api_service.dart';
import '../utils/health_calculator.dart';
import 'auth_provider.dart';

class MealProvider extends StateNotifier<MealState> {
  final Ref ref;
  final FoodApiService _foodApi = FoodApiService();

  MealProvider(this.ref) : super(MealState());

  Future<void> fetchTodayStats() async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/meals/today');
      if (response.statusCode == 200) {
        state = state.copyWith(
          todayStats: response.data,
          isLoading: false,
        );
        _updateCalculatedGoals();
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void _updateCalculatedGoals() {
    final user = ref.read(authProvider).user;
    if (user != null && user.currentWeightKg != null && user.heightCm != null) {
      final calculatedGoals = HealthCalculator.calculateDailyGoals(
        weightKg: user.currentWeightKg!,
        heightCm: user.heightCm!,
        age: user.age ?? 25,
        isMale: user.gender?.toLowerCase() == 'male',
        goal: user.fitnessGoal ?? 'maintain',
        activityFactor: 1.5, // Default active
      );
      state = state.copyWith(calculatedGoals: calculatedGoals);
    }
  }

  Future<List<Map<String, dynamic>>> searchMealsExternally(String query) async {
    if (query.length < 2) return [];
    
    // Search both USDA and OFF
    final usdaResults = await _foodApi.searchUSDA(query);
    final offResults = await _foodApi.searchOpenFoodFacts(query);
    
    return [...usdaResults, ...offResults];
  }

  Future<List<dynamic>> searchAvailableMeals(String query) async {
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/meals/available');
      if (response.statusCode == 200) {
        List<dynamic> all = response.data['meals'];
        if (query.isEmpty) return all;
        return all.where((m) => m['name'].toLowerCase().contains(query.toLowerCase())).toList();
      }
    } catch (e) {
      debugPrint(e.toString());
    }
    return [];
  }

  Future<bool> logExternalMeal(Map<String, dynamic> meal, double quantityGrams, String type) async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      // We first create the meal in our DB if it doesn't exist, or just log it directly if the backend supports it.
      // For now, let's assume we send the nutritional info to the backend.
      final response = await dio.post('/user/meals/log-custom', data: {
        'name': meal['name'],
        'meal_type': type,
        'calories': (meal['calories'] * quantityGrams / 100),
        'protein': (meal['protein'] * quantityGrams / 100),
        'carbs': (meal['carbs'] * quantityGrams / 100),
        'fats': (meal['fats'] * quantityGrams / 100),
        'quantity_served': quantityGrams,
        'image_url': meal['image_url'],
      });
      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchTodayStats();
        return true;
      }
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      state = state.copyWith(isLoading: false);
    }
    return false;
  }

  Future<bool> logMeal(String mealId, double quantity, String type) async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      final response = await dio.post('/user/meals/log', data: {
        'meal_id': mealId,
        'quantity_served': quantity,
        'notes': 'Logged via mobile app ($type)',
      });
      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchTodayStats();
        return true;
      }
    } catch (e) {
      debugPrint(e.toString());
    } finally {
      state = state.copyWith(isLoading: false);
    }
    return false;
  }

  Future<bool> logWater(int ml) async {
    try {
      final dio = DioClient().dio;
      final response = await dio.post('/user/water/log', data: {'amount_ml': ml});
      if (response.statusCode == 200 || response.statusCode == 201) {
        await fetchTodayStats();
        return true;
      }
    } catch (e) {
      debugPrint(e.toString());
    }
    return false;
  }
}

class MealState {
  final Map<String, dynamic>? todayStats;
  final Map<String, double>? calculatedGoals;
  final bool isLoading;
  final String? error;

  MealState({this.todayStats, this.calculatedGoals, this.isLoading = false, this.error});

  MealState copyWith({
    Map<String, dynamic>? todayStats, 
    Map<String, double>? calculatedGoals,
    bool? isLoading, 
    String? error
  }) {
    return MealState(
      todayStats: todayStats ?? this.todayStats,
      calculatedGoals: calculatedGoals ?? this.calculatedGoals,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

final mealProvider = StateNotifierProvider<MealProvider, MealState>((ref) {
  return MealProvider(ref);
});

