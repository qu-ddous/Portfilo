class WorkoutModel {
  final String id;
  final String name;
  final String? description;
  final String difficulty;
  final int? durationMinutes;
  final List<WorkoutExercise>? exercises;

  WorkoutModel({
    required this.id,
    required this.name,
    this.description,
    required this.difficulty,
    this.durationMinutes,
    this.exercises,
  });

  factory WorkoutModel.fromJson(Map<String, dynamic> json) {
    return WorkoutModel(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      difficulty: json['difficulty'] ?? 'intermediate',
      durationMinutes: json['duration_minutes'],
      exercises: (json['workout_exercises'] as List?)
          ?.map((e) => WorkoutExercise.fromJson(e))
          .toList(),
    );
  }
}

class WorkoutExercise {
  final String? id;
  final String? name;
  final String? muscleGroup;
  final int? recommendedSets;
  final int? recommendedReps;
  final double? recommendedWeightKg;
  final int? restSeconds;

  WorkoutExercise({
    this.id,
    this.name,
    this.muscleGroup,
    this.recommendedSets,
    this.recommendedReps,
    this.recommendedWeightKg,
    this.restSeconds,
  });

  factory WorkoutExercise.fromJson(Map<String, dynamic> json) {
    // Handling both nested and flat responses
    final ex = json['exercises'] ?? json;
    return WorkoutExercise(
      id: ex['id'],
      name: ex['name'],
      muscleGroup: ex['muscle_group'],
      recommendedSets: json['recommended_sets'],
      recommendedReps: json['recommended_reps'],
      recommendedWeightKg: (json['recommended_weight_kg'] as num?)?.toDouble(),
      restSeconds: json['rest_seconds'],
    );
  }
}
