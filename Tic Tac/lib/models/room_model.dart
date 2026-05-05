import 'package:hive/hive.dart';

part 'room_model.g.dart';

@HiveType(typeId: 4)
class RoomModel {
  @HiveField(0)
  final String id;
  
  @HiveField(1)
  final String code;
  
  @HiveField(2)
  final String hostId;
  
  @HiveField(3)
  final String roomName;
  
  @HiveField(4)
  final int gridSize;
  
  @HiveField(5)
  final int maxPlayers;
  
  @HiveField(6)
  final String status;
  
  @HiveField(7)
  final List<String> playerIds;
  
  @HiveField(8)
  final DateTime createdAt;
  
  @HiveField(9)
  final DateTime? updatedAt;

  RoomModel({
    required this.id,
    required this.code,
    required this.hostId,
    required this.roomName,
    this.gridSize = 3,
    this.maxPlayers = 2,
    this.status = 'waiting',
    this.playerIds = const [],
    required this.createdAt,
    this.updatedAt,
  });

  RoomModel copyWith({
    String? id,
    String? code,
    String? hostId,
    String? roomName,
    int? gridSize,
    int? maxPlayers,
    String? status,
    List<String>? playerIds,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return RoomModel(
      id: id ?? this.id,
      code: code ?? this.code,
      hostId: hostId ?? this.hostId,
      roomName: roomName ?? this.roomName,
      gridSize: gridSize ?? this.gridSize,
      maxPlayers: maxPlayers ?? this.maxPlayers,
      status: status ?? this.status,
      playerIds: playerIds ?? List<String>.from(this.playerIds),
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  factory RoomModel.fromJson(Map<String, dynamic> json) {
    return RoomModel(
      id: json['id'] as String,
      code: json['code'] as String,
      hostId: json['host_id'] ?? json['hostId'] as String,
      roomName: json['room_name'] ?? json['roomName'] as String,
      gridSize: json['grid_size'] ?? json['gridSize'] ?? 3,
      maxPlayers: json['max_players'] ?? json['maxPlayers'] ?? 2,
      status: json['status'] as String? ?? 'waiting',
      playerIds: json['player_ids'] != null || json['playerIds'] != null
          ? List<String>.from(json['player_ids'] ?? json['playerIds'])
          : [],
      createdAt: DateTime.parse(json['created_at'] ?? json['createdAt']),
      updatedAt: json['updated_at'] != null || json['updatedAt'] != null
          ? DateTime.parse(json['updated_at'] ?? json['updatedAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'code': code,
      'hostId': hostId,
      'roomName': roomName,
      'gridSize': gridSize,
      'maxPlayers': maxPlayers,
      'status': status,
      'playerIds': playerIds,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  bool get isFull => playerIds.length >= maxPlayers;
  bool get isWaiting => status == 'waiting';
  bool get isPlaying => status == 'playing';
  bool get isFinished => status == 'finished';
  int get currentPlayerCount => playerIds.length;
}
