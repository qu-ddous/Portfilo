import 'package:hive/hive.dart';

part 'achievement_model.g.dart';

@HiveType(typeId: 3)
class AchievementModel {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final String icon;
  
  @HiveField(4)
  final DateTime? unlockedAt;
  
  @HiveField(5)
  final bool isUnlocked;

  AchievementModel({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    this.unlockedAt,
    this.isUnlocked = false,
  });

  AchievementModel copyWith({
    String? id,
    String? name,
    String? description,
    String? icon,
    DateTime? unlockedAt,
    bool? isUnlocked,
  }) {
    return AchievementModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      icon: icon ?? this.icon,
      unlockedAt: unlockedAt ?? this.unlockedAt,
      isUnlocked: isUnlocked ?? this.isUnlocked,
    );
  }

  factory AchievementModel.fromJson(Map<String, dynamic> json) {
    return AchievementModel(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      unlockedAt: json['unlocked_at'] != null || json['unlockedAt'] != null
          ? DateTime.parse(json['unlocked_at'] ?? json['unlockedAt'])
          : null,
      isUnlocked: json['is_unlocked'] ?? json['isUnlocked'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'icon': icon,
      'unlockedAt': unlockedAt?.toIso8601String(),
      'isUnlocked': isUnlocked,
    };
  }
}
