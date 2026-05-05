import 'package:hive/hive.dart';

part 'player_model.g.dart';

@HiveType(typeId: 1)
class PlayerModel {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String name;
  
  @HiveField(2)
  final String? email;
  
  @HiveField(3)
  final String? avatarUrl;
  
  @HiveField(4)
  final String status;
  
  @HiveField(5)
  final int totalWins;
  
  @HiveField(6)
  final int totalLosses;
  
  @HiveField(7)
  final int totalDraws;
  
  @HiveField(8)
  final int totalGames;
  
  @HiveField(9)
  final DateTime createdAt;
  
  @HiveField(10)
  final DateTime? lastLogin;

  PlayerModel({
    required this.id,
    required this.name,
    this.email,
    this.avatarUrl,
    this.status = 'active',
    this.totalWins = 0,
    this.totalLosses = 0,
    this.totalDraws = 0,
    this.totalGames = 0,
    required this.createdAt,
    this.lastLogin,
  });

  PlayerModel copyWith({
    String? id,
    String? name,
    String? email,
    String? avatarUrl,
    String? status,
    int? totalWins,
    int? totalLosses,
    int? totalDraws,
    int? totalGames,
    DateTime? createdAt,
    DateTime? lastLogin,
  }) {
    return PlayerModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      status: status ?? this.status,
      totalWins: totalWins ?? this.totalWins,
      totalLosses: totalLosses ?? this.totalLosses,
      totalDraws: totalDraws ?? this.totalDraws,
      totalGames: totalGames ?? this.totalGames,
      createdAt: createdAt ?? this.createdAt,
      lastLogin: lastLogin ?? this.lastLogin,
    );
  }

  factory PlayerModel.fromJson(Map<String, dynamic> json) {
    return PlayerModel(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String?,
      avatarUrl: json['avatar_url'] ?? json['avatarUrl'] as String?,
      status: json['status'] as String? ?? 'active',
      totalWins: json['total_wins'] ?? json['totalWins'] ?? 0,
      totalLosses: json['total_losses'] ?? json['totalLosses'] ?? 0,
      totalDraws: json['total_draws'] ?? json['totalDraws'] ?? 0,
      totalGames: json['total_games'] ?? json['totalGames'] ?? 0,
      createdAt: DateTime.parse(json['created_at'] ?? json['createdAt']),
      lastLogin: json['last_login'] != null || json['lastLogin'] != null
          ? DateTime.parse(json['last_login'] ?? json['lastLogin'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
      'status': status,
      'totalWins': totalWins,
      'totalLosses': totalLosses,
      'totalDraws': totalDraws,
      'totalGames': totalGames,
      'createdAt': createdAt.toIso8601String(),
      'lastLogin': lastLogin?.toIso8601String(),
    };
  }

  double get winRate {
    if (totalGames == 0) return 0.0;
    return (totalWins / totalGames) * 100;
  }

  String get winRateFormatted => '${winRate.toStringAsFixed(1)}%';
}
