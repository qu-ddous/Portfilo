import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/notification_provider.dart';
import '../../config/theme.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(notificationProvider.notifier).fetchNotifications();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(notificationProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppTheme.bgDark : AppTheme.bgLight,
      appBar: AppBar(
        title: Text("Intelligence Feed", style: GoogleFonts.outfit(fontWeight: FontWeight.w800, fontSize: 24)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (state.notifications.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: IconButton(
                onPressed: () => ref.read(notificationProvider.notifier).markAllAsRead(),
                icon: const Icon(Icons.done_all_rounded, color: AppTheme.primaryEmerald),
                tooltip: "Mark all as read",
              ),
            ),
        ],
      ),
      body: state.isLoading && state.notifications.isEmpty
          ? _buildLoadingState()
          : state.notifications.isEmpty
              ? _buildEmptyState(isDark)
              : RefreshIndicator(
                  onRefresh: () => ref.read(notificationProvider.notifier).fetchNotifications(),
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 10, 20, 100),
                    itemCount: state.notifications.length,
                    itemBuilder: (context, index) {
                      final notif = state.notifications[index];
                      return _buildNotificationItem(notif, isDark, index);
                    },
                  ),
                ),
    );
  }

  Widget _buildLoadingState() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: 6,
      itemBuilder: (context, index) => Container(
        height: 100,
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(24)),
      ).animate(onPlay: (c) => c.repeat()).shimmer(duration: 1.seconds),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(color: AppTheme.primaryEmerald.withValues(alpha: 0.05), shape: BoxShape.circle),
            child: Icon(Icons.notifications_none_rounded, size: 64, color: isDark ? Colors.white12 : Colors.black12),
          ),
          const SizedBox(height: 24),
          Text(
            "Nothing to report",
            style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w700, color: isDark ? Colors.white38 : Colors.black45),
          ),
          const SizedBox(height: 8),
          Text(
            "Your intelligence feed is clear.",
            style: GoogleFonts.outfit(fontSize: 14, color: isDark ? Colors.white24 : Colors.black26),
          ),
        ],
      ).animate().fadeIn().scale(delay: 200.ms),
    );
  }

  Widget _buildNotificationItem(Map<String, dynamic> notif, bool isDark, int index) {
    final bool isRead = notif['is_read'] ?? false;
    final type = notif['type'] ?? 'system_alert';
    final createdAt = notif['created_at'] != null ? DateTime.parse(notif['created_at']) : DateTime.now();
    final dateStr = DateFormat('h:mm a').format(createdAt);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: GestureDetector(
        onTap: () {
          if (!isRead) {
            ref.read(notificationProvider.notifier).markAsRead(notif['id']);
          }
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.surfaceDark : Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: isRead ? Colors.transparent : AppTheme.primaryEmerald.withValues(alpha: 0.2)),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10)],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  color: _getTypeColor(type).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(_getTypeIcon(type), color: _getTypeColor(type), size: 22),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _getTypeLabel(type),
                          style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w800, color: _getTypeColor(type), letterSpacing: 1),
                        ),
                        Text(dateStr, style: GoogleFonts.outfit(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w600)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notif['title'] ?? 'Platform Update',
                      style: GoogleFonts.outfit(fontSize: 16, fontWeight: isRead ? FontWeight.w600 : FontWeight.w800),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      notif['message'] ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.outfit(fontSize: 13, color: isDark ? Colors.white54 : Colors.black54, height: 1.4),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: index * 50)).slideX(begin: 0.1);
  }

  String _getTypeLabel(String type) {
    return type.replaceAll('_', ' ').toUpperCase();
  }

  IconData _getTypeIcon(String type) {
    switch (type) {
      case 'workout_assigned': return Icons.fitness_center_rounded;
      case 'meal_plan_assigned': return Icons.restaurant_menu_rounded;
      case 'goal_achieved': return Icons.emoji_events_rounded;
      case 'system_alert': return Icons.bolt_rounded;
      default: return Icons.notifications_active_rounded;
    }
  }

  Color _getTypeColor(String type) {
    switch (type) {
      case 'workout_assigned': return AppTheme.primaryEmerald;
      case 'meal_plan_assigned': return AppTheme.secondaryAmber;
      case 'goal_achieved': return const Color(0xFF8B5CF6);
      case 'system_alert': return const Color(0xFFEF4444);
      default: return AppTheme.infoBlue;
    }
  }
}
