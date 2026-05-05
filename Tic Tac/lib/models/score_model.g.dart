// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'score_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class ScoreModelAdapter extends TypeAdapter<ScoreModel> {
  @override
  final int typeId = 2;

  @override
  ScoreModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ScoreModel(
      id: fields[0] as String,
      playerId: fields[1] as String,
      gameId: fields[2] as String,
      opponentName: fields[3] as String,
      result: fields[4] as String,
      gridSize: fields[5] as int,
      createdAt: fields[6] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, ScoreModel obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.playerId)
      ..writeByte(2)
      ..write(obj.gameId)
      ..writeByte(3)
      ..write(obj.opponentName)
      ..writeByte(4)
      ..write(obj.result)
      ..writeByte(5)
      ..write(obj.gridSize)
      ..writeByte(6)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ScoreModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
