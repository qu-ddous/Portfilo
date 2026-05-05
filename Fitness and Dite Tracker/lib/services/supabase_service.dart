import 'dart:async';
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  final SupabaseClient client = Supabase.instance.client;

  // Real-time table names
  static const String tableMeals = 'meals';
  static const String tableWorkouts = 'workouts';
  static const String tableUserProfiles = 'user_profiles';
  static const String tableDailyLogs = 'daily_logs';

  // Listeners
  StreamSubscription? _mealsSubscription;
  StreamSubscription? _workoutsSubscription;

  void subscribeToMeals(Function(List<Map<String, dynamic>>) callback) {
    _mealsSubscription = client
        .from(tableMeals)
        .stream(primaryKey: ['id'])
        .listen((data) {
          callback(data);
        });
  }

  void subscribeToWorkouts(Function(List<Map<String, dynamic>>) callback) {
    _workoutsSubscription = client
        .from(tableWorkouts)
        .stream(primaryKey: ['id'])
        .listen((data) {
          callback(data);
        });
  }

  void dispose() {
    _mealsSubscription?.cancel();
    _workoutsSubscription?.cancel();
  }
}
