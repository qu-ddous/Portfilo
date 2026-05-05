import 'package:socket_io_client/socket_io_client.dart' as io;
import '../config/api_config.dart';
import 'storage_service.dart';

class SocketService {
  static io.Socket? _socket;
  static bool _isConnected = false;

  static bool get isConnected => _isConnected;

  static Future<void> connect() async {
    if (_socket != null && _isConnected) return;

    final token = await StorageService.getAuthToken();

    _socket = io.io(
      ApiConfig.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      _isConnected = true;
      // Connected successfully
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
      // Disconnected
    });

    _socket!.onError((error) {
      // Socket error occurred
    });
  }

  static void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _isConnected = false;
  }

  // Emit events
  static void createRoom(Map<String, dynamic> data) {
    _socket?.emit('game:create-room', data);
  }

  static void joinRoom(String roomCode) {
    _socket?.emit('game:join-room', {'roomCode': roomCode});
  }

  static void makeMove(Map<String, dynamic> data) {
    _socket?.emit('game:move', data);
  }

  static void forfeitGame(String gameId) {
    _socket?.emit('game:forfeit', {'gameId': gameId});
  }

  static void restartGame(String gameId) {
    _socket?.emit('game:restart', {'gameId': gameId});
  }

  static void leaveRoom(String roomCode) {
    _socket?.emit('game:leave', {'roomCode': roomCode});
  }

  static void sendChat(String roomCode, String message) {
    _socket?.emit('game:chat', {'roomCode': roomCode, 'message': message});
  }

  // Listen to events
  static void onRoomCreated(Function(dynamic) callback) {
    _socket?.on('game:room-created', callback);
  }

  static void onPlayerJoined(Function(dynamic) callback) {
    _socket?.on('game:player-joined', callback);
  }

  static void onMoveReceived(Function(dynamic) callback) {
    _socket?.on('game:move-received', callback);
  }

  static void onGameStarted(Function(dynamic) callback) {
    _socket?.on('game:game-started', callback);
  }

  static void onGameEnded(Function(dynamic) callback) {
    _socket?.on('game:game-ended', callback);
  }

  static void onGameUpdated(Function(dynamic) callback) {
    _socket?.on('game:game-updated', callback);
  }

  static void onOpponentDisconnected(Function(dynamic) callback) {
    _socket?.on('game:opponent-disconnected', callback);
  }

  static void onRoomClosed(Function(dynamic) callback) {
    _socket?.on('game:room-closed', callback);
  }

  static void onChatMessage(Function(dynamic) callback) {
    _socket?.on('game:chat-message', callback);
  }

  static void onError(Function(dynamic) callback) {
    _socket?.on('game:error', callback);
  }

  // Remove listeners
  static void offRoomCreated() {
    _socket?.off('game:room-created');
  }

  static void offPlayerJoined() {
    _socket?.off('game:player-joined');
  }

  static void offMoveReceived() {
    _socket?.off('game:move-received');
  }

  static void offGameStarted() {
    _socket?.off('game:game-started');
  }

  static void offGameEnded() {
    _socket?.off('game:game-ended');
  }

  static void offGameUpdated() {
    _socket?.off('game:game-updated');
  }

  static void offOpponentDisconnected() {
    _socket?.off('game:opponent-disconnected');
  }

  static void offRoomClosed() {
    _socket?.off('game:room-closed');
  }

  static void offChatMessage() {
    _socket?.off('game:chat-message');
  }

  static void offError() {
    _socket?.off('game:error');
  }

  static void offAll() {
    offRoomCreated();
    offPlayerJoined();
    offMoveReceived();
    offGameStarted();
    offGameEnded();
    offGameUpdated();
    offOpponentDisconnected();
    offRoomClosed();
    offChatMessage();
    offError();
  }
}
