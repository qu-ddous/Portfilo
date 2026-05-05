// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'room_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class RoomModelAdapter extends TypeAdapter<RoomModel> {
  @override
  final int typeId = 4;

  @override
  RoomModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return RoomModel(
      id: fields[0] as String,
      code: fields[1] as String,
      hostId: fields[2] as String,
      roomName: fields[3] as String,
      gridSize: fields[4] as int,
      maxPlayers: fields[5] as int,
      status: fields[6] as String,
      playerIds: (fields[7] as List).cast<String>(),
      createdAt: fields[8] as DateTime,
      updatedAt: fields[9] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, RoomModel obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.code)
      ..writeByte(2)
      ..write(obj.hostId)
      ..writeByte(3)
      ..write(obj.roomName)
      ..writeByte(4)
      ..write(obj.gridSize)
      ..writeByte(5)
      ..write(obj.maxPlayers)
      ..writeByte(6)
      ..write(obj.status)
      ..writeByte(7)
      ..write(obj.playerIds)
      ..writeByte(8)
      ..write(obj.createdAt)
      ..writeByte(9)
      ..write(obj.updatedAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RoomModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
