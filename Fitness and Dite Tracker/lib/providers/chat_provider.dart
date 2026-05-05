import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io_client;
import '../config/constants.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';

class ChatMessage {
  final String id;
  final String senderId;
  final String receiverId;
  final String message;
  final DateTime createdAt;
  final bool isRead;

  ChatMessage({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.message,
    required this.createdAt,
    this.isRead = false,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      senderId: json['sender_id'],
      receiverId: json['receiver_id'],
      message: json['message'],
      createdAt: DateTime.parse(json['created_at']),
      isRead: json['is_read'] ?? false,
    );
  }
}

class ChatState {
  final List<ChatMessage> messages;
  final bool isLoading;
  final bool isSending;

  ChatState({
    this.messages = const [],
    this.isLoading = false,
    this.isSending = false,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    bool? isLoading,
    bool? isSending,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      isSending: isSending ?? this.isSending,
    );
  }
}

class ChatNotifier extends StateNotifier<ChatState> {
  io_client.Socket? _socket;
  final Ref _ref;
  final ApiService _api = ApiService();

  ChatNotifier(this._ref) : super(ChatState()) {
    _initSocket();
  }

  void _initSocket() {
    final auth = _ref.watch(authProvider);
    if (auth.user == null) return;

    _socket = io_client.io(AppConstants.socketUrl, io_client.OptionBuilder()
      .setTransports(['websocket'])
      .setAuth({'token': auth.user?.id}) // Simplified, real token is better
      .build());

    _socket!.onConnect((_) {
      debugPrint('💬 Chat Socket Connected');
    });

    _socket!.on('new_chat_message', (data) {
      final msg = ChatMessage.fromJson(data);
      state = state.copyWith(messages: [...state.messages, msg]);
    });
  }

  Future<void> fetchMessages(String otherUserId) async {
    state = state.copyWith(isLoading: true);
    try {
      final response = await _api.get('/chat/messages/$otherUserId');
      if (response['success'] == true) {
        final List<dynamic> msgsData = response['messages'];
        final msgs = msgsData.map((m) => ChatMessage.fromJson(m)).toList();
        state = state.copyWith(messages: msgs, isLoading: false);
      }
    } catch (e) {
      debugPrint('Error fetching messages: $e');
      state = state.copyWith(isLoading: false);
    }
  }

  Future<bool> sendMessage(String receiverId, String message) async {
    if (message.trim().isEmpty) return false;
    
    state = state.copyWith(isSending: true);
    try {
      final response = await _api.post('/chat/send', {
        'receiver_id': receiverId,
        'message': message,
      });

      if (response['success'] == true) {
        final newMsg = ChatMessage.fromJson(response['message']);
        state = state.copyWith(
          messages: [...state.messages, newMsg],
          isSending: false,
        );
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('Error sending message: $e');
      state = state.copyWith(isSending: false);
      return false;
    }
  }

  Future<String?> fetchSupportAdmin() async {
    try {
      final response = await _api.get('/auth/admin-info'); // Need to create this or find equivalent
      if (response['success'] == true) {
        return response['admin']['id'];
      }
    } catch (e) {
       // Fallback: check conversations
       final res = await _api.get('/chat/conversations');
       if (res['success'] == true && res['conversations'].isNotEmpty) {
          return res['conversations'][0]['user']['id'];
       }
    }
    return null;
  }

  Future<bool> sendToSupport(String message) async {
    final adminId = await fetchSupportAdmin();
    if (adminId == null) return false;
    return await sendMessage(adminId, message);
  }

  @override
  void dispose() {
    _socket?.dispose();
    super.dispose();
  }
}

final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  return ChatNotifier(ref);
});
