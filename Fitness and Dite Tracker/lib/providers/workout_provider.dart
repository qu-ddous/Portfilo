import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../config/dio_client.dart';
import '../services/workout_api_service.dart';

class WorkoutProvider extends StateNotifier<WorkoutState> {
  final Ref ref;
  final WorkoutApiService _workoutApi = WorkoutApiService();

  WorkoutProvider(this.ref) : super(WorkoutState());

  Future<void> fetchAssignedWorkouts() async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/workouts/assigned');
      if (response.statusCode == 200) {
        state = state.copyWith(
          assignedWorkouts: response.data['workouts'] ?? [],
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> fetchHistory() async {
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/workouts/history');
      if (response.statusCode == 200) {
        state = state.copyWith(history: response.data['workouts'] ?? []);
      }
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  Future<void> fetchAvailableWorkouts() async {
    state = state.copyWith(isLoading: true);
    try {
      final dio = DioClient().dio;
      final response = await dio.get('/user/workouts/available');
      if (response.statusCode == 200) {
        final workouts = response.data['workouts'] as List;
        if (workouts.isEmpty) {
          state = state.copyWith(availableWorkouts: _mockWorkouts, isLoading: false);
        } else {
          state = state.copyWith(availableWorkouts: workouts, isLoading: false);
        }
      }
    } catch (e) {
      // Fallback to mocks on error (like 404)
      state = state.copyWith(availableWorkouts: _mockWorkouts, isLoading: false);
    }
  }

  final List<Map<String, dynamic>> _mockWorkouts = [
    {
      'id': 'mock_1',
      'name': 'Full Body Shred',
      'difficulty': 'Intermediate',
      'duration_minutes': 45,
      'image_url': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    },
    {
      'id': 'mock_2',
      'name': 'Upper Body Power',
      'difficulty': 'Advanced',
      'duration_minutes': 60,
      'image_url': 'https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?w=800',
    },
    {
      'id': 'mock_3',
      'name': 'Yoga Mobility',
      'difficulty': 'Beginner',
      'duration_minutes': 30,
      'image_url': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    },
    {
      'id': 'mock_4',
      'name': 'HIIT Cardio Blast',
      'difficulty': 'Advanced',
      'duration_minutes': 25,
      'image_url': 'https://images.unsplash.com/photo-1549576490-b0b4831da60a?w=800',
    },
  ];

  Future<List<Map<String, dynamic>>> getWorkoutVideos(String query) async {
    return await _workoutApi.fetchExerciseVideos(query);
  }

  Future<bool> quickLogWorkout(String workoutId, int duration) async {
    try {
      final dio = DioClient().dio;
      final response = await dio.post('/user/workouts/$workoutId/quick-log', data: {
        'duration_minutes': duration,
      });
      if (response.statusCode == 201) {
        await fetchHistory();
        return true;
      }
    } catch (e) {
      debugPrint(e.toString());
    }
    return false;
  }
}

class WorkoutState {
  final List<dynamic> assignedWorkouts;
  final List<dynamic> availableWorkouts;
  final List<dynamic> history;
  final bool isLoading;
  final String? error;

  WorkoutState({
    this.assignedWorkouts = const [],
    this.availableWorkouts = const [],
    this.history = const [],
    this.isLoading = false,
    this.error,
  });

  WorkoutState copyWith({
    List<dynamic>? assignedWorkouts,
    List<dynamic>? availableWorkouts,
    List<dynamic>? history,
    bool? isLoading,
    String? error,
  }) {
    return WorkoutState(
      assignedWorkouts: assignedWorkouts ?? this.assignedWorkouts,
      availableWorkouts: availableWorkouts ?? this.availableWorkouts,
      history: history ?? this.history,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

final workoutProvider = StateNotifierProvider<WorkoutProvider, WorkoutState>((ref) {
  return WorkoutProvider(ref);
});

