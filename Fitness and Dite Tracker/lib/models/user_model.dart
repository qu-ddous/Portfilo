class UserModel {
  final String id;
  final String email;
  final String name;
  final int? age;
  final String? gender;
  final double? heightCm;
  final double? currentWeightKg;
  final double? targetWeightKg;
  final String? activityLevel;
  final String? fitnessGoal;
  final int? dailyCalorieTarget;
  final String? role;
  final String? avatar;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    this.age,
    this.gender,
    this.heightCm,
    this.currentWeightKg,
    this.targetWeightKg,
    this.activityLevel,
    this.fitnessGoal,
    this.dailyCalorieTarget,
    this.role,
    this.avatar,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      age: json['age'],
      gender: json['gender'],
      heightCm: (json['height_cm'] as num?)?.toDouble(),
      currentWeightKg: (json['current_weight_kg'] as num?)?.toDouble(),
      targetWeightKg: (json['target_weight_kg'] as num?)?.toDouble(),
      activityLevel: json['activity_level'],
      fitnessGoal: json['fitness_goal'],
      dailyCalorieTarget: json['daily_calorie_target'],
      role: json['role'],
      avatar: json['avatar'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'age': age,
      'gender': gender,
      'height_cm': heightCm,
      'current_weight_kg': currentWeightKg,
      'target_weight_kg': targetWeightKg,
      'activity_level': activityLevel,
      'fitness_goal': fitnessGoal,
      'daily_calorie_target': dailyCalorieTarget,
      'role': role,
      'avatar': avatar,
    };
  }
}
