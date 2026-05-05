import 'package:hive/hive.dart';

part 'game_model.g.dart';

@HiveType(typeId: 0)
class GameModel {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String gameMode;
  
  @HiveField(2)
  final int gridSize;
  
  @HiveField(3)
  final String status;
  
  @HiveField(4)
  final List<List<String>> board;
  
  @HiveField(5)
  final String currentPlayer;
  
  @HiveField(6)
  final String? winner;
  
  @HiveField(7)
  final List<int>? winningLine;
  
  @HiveField(8)
  final String? aiDifficulty;
  
  @HiveField(9)
  final String? playerXId;
  
  @HiveField(10)
  final String? playerOId;
  
  @HiveField(11)
  final String? playerXName;
  
  @HiveField(12)
  final String? playerOName;
  
  @HiveField(13)
  final DateTime createdAt;
  
  @HiveField(14)
  final DateTime? endedAt;
  
  @HiveField(15)
  final int moveCount;

  GameModel({
    required this.id,
    required this.gameMode,
    required this.gridSize,
    required this.status,
    required this.board,
    required this.currentPlayer,
    this.winner,
    this.winningLine,
    this.aiDifficulty,
    this.playerXId,
    this.playerOId,
    this.playerXName,
    this.playerOName,
    required this.createdAt,
    this.endedAt,
    this.moveCount = 0,
  });

  GameModel copyWith({
    String? id,
    String? gameMode,
    int? gridSize,
    String? status,
    List<List<String>>? board,
    String? currentPlayer,
    String? winner,
    List<int>? winningLine,
    String? aiDifficulty,
    String? playerXId,
    String? playerOId,
    String? playerXName,
    String? playerOName,
    DateTime? createdAt,
    DateTime? endedAt,
    int? moveCount,
  }) {
    return GameModel(
      id: id ?? this.id,
      gameMode: gameMode ?? this.gameMode,
      gridSize: gridSize ?? this.gridSize,
      status: status ?? this.status,
      board: board ?? this.board.map((row) => List<String>.from(row)).toList(),
      currentPlayer: currentPlayer ?? this.currentPlayer,
      winner: winner ?? this.winner,
      winningLine: winningLine ?? this.winningLine,
      aiDifficulty: aiDifficulty ?? this.aiDifficulty,
      playerXId: playerXId ?? this.playerXId,
      playerOId: playerOId ?? this.playerOId,
      playerXName: playerXName ?? this.playerXName,
      playerOName: playerOName ?? this.playerOName,
      createdAt: createdAt ?? this.createdAt,
      endedAt: endedAt ?? this.endedAt,
      moveCount: moveCount ?? this.moveCount,
    );
  }

  factory GameModel.fromJson(Map<String, dynamic> json) {
    return GameModel(
      id: json['id'] as String,
      gameMode: json['game_mode'] ?? json['gameMode'] as String,
      gridSize: json['grid_size'] ?? json['gridSize'] as int,
      status: json['status'] as String,
      board: (json['board'] as List)
          .map((row) => (row as List).map((cell) => cell.toString()).toList())
          .toList(),
      currentPlayer: json['current_player'] ?? json['currentPlayer'] as String,
      winner: json['winner'] as String?,
      winningLine: json['winning_line'] != null || json['winningLine'] != null
          ? List<int>.from(json['winning_line'] ?? json['winningLine'])
          : null,
      aiDifficulty: json['ai_difficulty'] ?? json['aiDifficulty'] as String?,
      playerXId: json['player_x_id'] ?? json['playerXId'] as String?,
      playerOId: json['player_o_id'] ?? json['playerOId'] as String?,
      playerXName: json['player_x_name'] ?? json['playerXName'] as String?,
      playerOName: json['player_o_name'] ?? json['playerOName'] as String?,
      createdAt: DateTime.parse(json['created_at'] ?? json['createdAt']),
      endedAt: json['ended_at'] != null || json['endedAt'] != null
          ? DateTime.parse(json['ended_at'] ?? json['endedAt'])
          : null,
      moveCount: json['move_count'] ?? json['moveCount'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'gameMode': gameMode,
      'gridSize': gridSize,
      'status': status,
      'board': board,
      'currentPlayer': currentPlayer,
      'winner': winner,
      'winningLine': winningLine,
      'aiDifficulty': aiDifficulty,
      'playerXId': playerXId,
      'playerOId': playerOId,
      'playerXName': playerXName,
      'playerOName': playerOName,
      'createdAt': createdAt.toIso8601String(),
      'endedAt': endedAt?.toIso8601String(),
      'moveCount': moveCount,
    };
  }

  bool get isGameOver => status != 'playing';
  bool get isDraw => status == 'draw';
  bool get hasWinner => winner != null;
  
  Duration? get duration {
    if (endedAt == null) return null;
    return endedAt!.difference(createdAt);
  }
}
