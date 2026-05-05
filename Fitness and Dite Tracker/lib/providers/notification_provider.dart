import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io_client;
import '../config/constants.dart';
import 'auth_provider.dart';
import '../services/api_service.dart';

class NotificationState {
  final List<Map<String, dynamic>> notifications;
  final int unreadCount;
  final bool isConnected;
  final bool isLoading;

  NotificationState({
    this.notifications = const [], 
    this.unreadCount = 0,
    this.isConnected = false,
    this.isLoading = false,
  });

  NotificationState copyWith({
    List<Map<String, dynamic>>? notifications, 
    int? unreadCount,
    bool? isConnected,
    bool? isLoading,
  }) {
    return NotificationState(
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      isConnected: isConnected ?? this.isConnected,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class NotificationNotifier extends StateNotifier<NotificationState> {
  io_client.Socket? _socket;
  final Ref _ref;
  final _api = ApiService();

  NotificationNotifier(this._ref) : super(NotificationState()) {
    _initSocket();
    fetchNotifications();
  }

  void _initSocket() {
    final auth = _ref.watch(authProvider);
    if (auth.user == null) return;

    _socket = io_client.io(AppConstants.socketUrl, io_client.OptionBuilder()
      .setTransports(['websocket'])
      .setAuth({'token': auth.user?.id})
      .enableAutoConnect()
      .build());

    _socket!.onConnect((_) {
      state = state.copyWith(isConnected: true);
      debugPrint('🔌 Flutter Socket Connected');
    });

    _socket!.onDisconnect((_) => state = state.copyWith(isConnected: false));

    _socket!.on('broadcast_notification', (data) {
      _addNotification(data);
    });

    _socket!.on('new_chat_message', (data) {
      // Handle badge for chat possibly here or in chat provider
    });
  }

  Future<void> fetchNotifications() async {
    state = state.copyWith(isLoading: true);
    try {
      final response = await _api.get('/user/notifications');
      if (response['success'] == true) {
        state = state.copyWith(
          notifications: List<Map<String, dynamic>>.from(response['notifications']),
          unreadCount: response['unread_count'] ?? 0,
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _api.put('/user/notifications/$id/read', {});
      fetchNotifications();
    } catch (e) {
      debugPrint('Error marking as read: $e');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _api.post('/user/notifications/read-all', {});
      fetchNotifications();
    } catch (e) {
      debugPrint('Error marking all as read: $e');
    }
  }

  void _addNotification(Map<String, dynamic> notif) {
    state = state.copyWith(
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    );
  }

  @override
  void dispose() {
    _socket?.dispose();
    super.dispose();
  }
}

final notificationProvider = StateNotifierProvider<NotificationNotifier, NotificationState>((ref) {
  return NotificationNotifier(ref);
});
