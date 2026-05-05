// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'player_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class PlayerModelAdapter extends TypeAdapter<PlayerModel> {
  @override
  final int typeId = 1;

  @override
  PlayerModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return PlayerModel(
      id: fields[0] as String,
      name: fields[1] as String,
      email: fields[2] as String?,
      avatarUrl: fields[3] as String?,
      status: fields[4] as String,
      totalWins: fields[5] as int,
      totalLosses: fields[6] as int,
      totalDraws: fields[7] as int,
      totalGames: fields[8] as int,
      createdAt: fields[9] as DateTime,
      lastLogin: fields[10] as DateTime?,
    );
  }

  @override
  void write(BinaryWriter writer, PlayerModel obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.email)
      ..writeByte(3)
      ..write(obj.avatarUrl)
      ..writeByte(4)
      ..write(obj.status)
      ..writeByte(5)
      ..write(obj.totalWins)
      ..writeByte(6)
      ..write(obj.totalLosses)
      ..writeByte(7)
      ..write(obj.totalDraws)
      ..writeByte(8)
      ..write(obj.totalGames)
      ..writeByte(9)
      ..write(obj.createdAt)
      ..writeByte(10)
      ..write(obj.lastLogin);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PlayerModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
