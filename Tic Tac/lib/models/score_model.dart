import 'package:hive/hive.dart';

part 'score_model.g.dart';

@HiveType(typeId: 2)
class ScoreModel {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String playerId;
  
  @HiveField(2)
  final String gameId;
  
  @HiveField(3)
  final String opponentName;
  
  @HiveField(4)
  final String result;
  
  @HiveField(5)
  final int gridSize;
  
  @HiveField(6)
  final DateTime createdAt;

  ScoreModel({
    required this.id,
    required this.playerId,
    required this.gameId,
    required this.opponentName,
    required this.result,
    required this.gridSize,
    required this.createdAt,
  });

  factory ScoreModel.fromJson(Map<String, dynamic> json) {
    return ScoreModel(
      id: json['id'] as String,
      playerId: json['player_id'] ?? json['playerId'] as String,
      gameId: json['game_id'] ?? json['gameId'] as String,
      opponentName: json['opponent_name'] ?? json['opponentName'] as String,
      result: json['result'] as String,
      gridSize: json['grid_size'] ?? json['gridSize'] as int,
      createdAt: DateTime.parse(json['created_at'] ?? json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'playerId': playerId,
      'gameId': gameId,
      'opponentName': opponentName,
      'result': result,
      'gridSize': gridSize,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  bool get isWin => result == 'win';
  bool get isLoss => result == 'loss';
  bool get isDraw => result == 'draw';
}
