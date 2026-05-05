// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'game_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class GameModelAdapter extends TypeAdapter<GameModel> {
  @override
  final int typeId = 0;

  @override
  GameModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return GameModel(
      id: fields[0] as String,
      gameMode: fields[1] as String,
      gridSize: fields[2] as int,
      status: fields[3] as String,
      board: (fields[4] as List)
          .map((dynamic e) => (e as List).cast<String>())
          .toList(),
      currentPlayer: fields[5] as String,
      winner: fields[6] as String?,
      winningLine: (fields[7] as List?)?.cast<int>(),
      aiDifficulty: fields[8] as String?,
      playerXId: fields[9] as String?,
      playerOId: fields[10] as String?,
      playerXName: fields[11] as String?,
      playerOName: fields[12] as String?,
      createdAt: fields[13] as DateTime,
      endedAt: fields[14] as DateTime?,
      moveCount: fields[15] as int,
    );
  }

  @override
  void write(BinaryWriter writer, GameModel obj) {
    writer
      ..writeByte(16)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.gameMode)
      ..writeByte(2)
      ..write(obj.gridSize)
      ..writeByte(3)
      ..write(obj.status)
      ..writeByte(4)
      ..write(obj.board)
      ..writeByte(5)
      ..write(obj.currentPlayer)
      ..writeByte(6)
      ..write(obj.winner)
      ..writeByte(7)
      ..write(obj.winningLine)
      ..writeByte(8)
      ..write(obj.aiDifficulty)
      ..writeByte(9)
      ..write(obj.playerXId)
      ..writeByte(10)
      ..write(obj.playerOId)
      ..writeByte(11)
      ..write(obj.playerXName)
      ..writeByte(12)
      ..write(obj.playerOName)
      ..writeByte(13)
      ..write(obj.createdAt)
      ..writeByte(14)
      ..write(obj.endedAt)
      ..writeByte(15)
      ..write(obj.moveCount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GameModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
