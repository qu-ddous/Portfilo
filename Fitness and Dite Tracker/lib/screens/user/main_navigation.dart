import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'home_screen.dart';
import 'workout_log_screen.dart';
import 'meal_log_screen.dart';
import 'profile_screen.dart';
import 'notifications_screen.dart';
import 'chat_screen.dart';
import '../../providers/auth_provider.dart';
import '../../providers/notification_provider.dart';
import '../../widgets/notification_overlay.dart';
import '../../config/theme.dart';
import '../../widgets/animated_icon_wrapper.dart';

final GlobalKey<ScaffoldState> rootScaffoldKey = GlobalKey<ScaffoldState>();

class MainNavigationShell extends ConsumerStatefulWidget {
  const MainNavigationShell({super.key});

  @override
  ConsumerState<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends ConsumerState<MainNavigationShell> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    UserHomeScreen(),
    MealLogScreen(),
    WorkoutLogScreen(),
    ProfileScreen(),
  ];

  final List<_NavItem> _navItems = const [
    _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: "Home"),
    _NavItem(icon: Icons.restaurant_menu_outlined, activeIcon: Icons.restaurant_menu_rounded, label: "Meals"),
    _NavItem(icon: Icons.fitness_center_outlined, activeIcon: Icons.fitness_center_rounded, label: "Workout"),
    _NavItem(icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: "Profile"),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    ref.listen<NotificationState>(notificationProvider, (previous, next) {
      if (next.notifications.length > (previous?.notifications.length ?? 0)) {
        final lastNotif = next.notifications.first;
        NotificationOverlay.show(
          context,
          lastNotif['title'] as String,
          lastNotif['message'] as String,
        );
      }
    });

    return Scaffold(
      key: rootScaffoldKey,
      drawer: _buildAppDrawer(context),
      body: _screens[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? AppTheme.surfaceDark : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(_navItems.length, (index) {
                final item = _navItems[index];
                final isSelected = _selectedIndex == index;
                
                return GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => setState(() => _selectedIndex = index),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 300),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppTheme.primaryEmerald.withValues(alpha: 0.1)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: AnimatedIconWrapper(
                          continuous: isSelected,
                          child: Icon(
                            isSelected ? item.activeIcon : item.icon,
                            color: isSelected ? AppTheme.primaryEmerald : Colors.grey,
                            size: 26,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.label,
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? AppTheme.primaryEmerald : Colors.grey,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAppDrawer(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = ref.watch(authProvider).user;

    return Drawer(
      backgroundColor: isDark ? AppTheme.surfaceDark : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.horizontal(right: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [AppTheme.primaryEmerald, AppTheme.secondaryAmber],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.primaryEmerald.withValues(alpha: 0.2),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(32),
                          child: user?.avatar != null
                              ? (user!.avatar!.startsWith('data:')
                                  ? Image.memory(
                                      base64Decode(user.avatar!.split(',').last),
                                      fit: BoxFit.cover,
                                    )
                                  : CachedNetworkImage(
                                      imageUrl: user.avatar!,
                                      fit: BoxFit.cover,
                                      placeholder: (context, url) => const CircularProgressIndicator(strokeWidth: 2),
                                      errorWidget: (context, url, err) => const Icon(Icons.person, color: Colors.white, size: 32),
                                    ))
                              : const Icon(Icons.person, color: Colors.white, size: 32),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user?.name ?? "Guest User",
                              style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w700),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryEmerald.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                "PRO MEMBER",
                                style: GoogleFonts.outfit(fontSize: 10, color: AppTheme.primaryEmerald, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      _buildDrawerStat("Weight", "${user?.currentWeightKg?.toStringAsFixed(1) ?? '--'} kg"),
                      const SizedBox(width: 12),
                      _buildDrawerStat("Goal", (user?.fitnessGoal ?? "Set Goal").replaceAll('_', ' ').toUpperCase()),
                    ],
                  ),
                ],
              ),
            ),
            const Divider(height: 1, indent: 24, endIndent: 24),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  _drawerItem(context, Icons.notifications_active_outlined, "Notifications", () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen()));
                  }),
                  _drawerItem(context, Icons.bar_chart_rounded, "View Progress", () {
                    setState(() => _selectedIndex = 3); // Profile/Stats
                  }),
                  _drawerItem(context, Icons.forum_outlined, "Support Chat", () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatScreen()));
                  }),
                  _drawerItem(context, Icons.settings_outlined, "App Settings", () {}),
                  _drawerItem(context, Icons.help_outline_rounded, "Help & FAQ", () {}),
                  _drawerItem(context, Icons.info_outline_rounded, "About Vitality", () {}),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: SizedBox(
                width: double.infinity,
                child: TextButton.icon(
                  onPressed: () => ref.read(authProvider.notifier).logout(),
                  icon: const Icon(Icons.logout_rounded, color: AppTheme.errorRed, size: 20),
                  label: Text(
                    "Sign Out",
                    style: GoogleFonts.outfit(color: AppTheme.errorRed, fontWeight: FontWeight.w700, fontSize: 16),
                  ),
                  style: TextButton.styleFrom(
                    backgroundColor: AppTheme.errorRed.withValues(alpha: 0.08),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerStat(String label, String value) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(value, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 2),
            Text(label, style: GoogleFonts.outfit(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _drawerItem(BuildContext context, IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 24),
      leading: Icon(icon, color: AppTheme.primaryEmerald, size: 24),
      title: Text(title, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w600)),
      onTap: () {
        Navigator.pop(context);
        onTap();
      },
      visualDensity: VisualDensity.compact,
    );
  }
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const _NavItem({required this.icon, required this.activeIcon, required this.label});
}