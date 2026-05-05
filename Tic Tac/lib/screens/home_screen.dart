import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/constants.dart';
import '../config/routes.dart';
import '../providers/settings_provider.dart';
import '../providers/theme_provider.dart';
import '../services/haptics_service.dart';
import '../widgets/custom_button.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final playerName = ref.watch(playerNameProvider);
    final themeMode = ref.watch(themeModeProvider);
    final gridSizePreference = ref.watch(gridSizePreferenceProvider);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.spacingXl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back,',
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      Text(
                        playerName,
                        style: Theme.of(context).textTheme.displayMedium,
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          themeMode == ThemeMode.light
                              ? Icons.dark_mode
                              : Icons.light_mode,
                        ),
                        onPressed: () {
                          HapticsService.light();
                          ref.read(themeModeProvider.notifier).toggleTheme();
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.settings),
                        onPressed: () {
                          HapticsService.light();
                          Navigator.of(context).pushNamed(AppRoutes.settings);
                        },
                      ),
                    ],
                  ),
                ],
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingXxxl),

              // App Logo
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: Color(AppConstants.primaryColor),
                    borderRadius: BorderRadius.circular(AppConstants.radiusXl),
                  ),
                  child: const Icon(
                    Icons.grid_3x3,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              )
                  .animate()
                  .scale(delay: 200.ms, duration: 600.ms, curve: Curves.easeOutBack),

              const SizedBox(height: AppConstants.spacingXl),

              // App Title
              Center(
                child: Text(
                  AppConstants.appName,
                  style: Theme.of(context).textTheme.displayLarge,
                ),
              ).animate().fadeIn(delay: 400.ms, duration: 600.ms),

              const Spacer(),

              // Menu Buttons
              CustomButton(
                text: 'Play vs AI',
                icon: Icons.smart_toy,
                onPressed: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(AppRoutes.aiDifficulty);
                },
              ).animate().fadeIn(delay: 600.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingLg),

              CustomButton(
                text: 'Play with Friend',
                icon: Icons.people,
                onPressed: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(
                    AppRoutes.game,
                    arguments: {
                      'gameMode': AppConstants.gameModeLocal,
                      'gridSize': gridSizePreference,
                    },
                  );
                },
              ).animate().fadeIn(delay: 700.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingLg),

              CustomButton(
                text: 'Online Match',
                icon: Icons.wifi,
                onPressed: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(AppRoutes.onlineLobby);
                },
              ).animate().fadeIn(delay: 800.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingLg),

              CustomButton(
                text: 'Leaderboard',
                icon: Icons.leaderboard,
                onPressed: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(AppRoutes.leaderboard);
                },
                isPrimary: false,
              ).animate().fadeIn(delay: 900.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingLg),

              CustomButton(
                text: 'Achievements',
                icon: Icons.emoji_events,
                onPressed: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(AppRoutes.achievements);
                },
                isPrimary: false,
              ).animate().fadeIn(delay: 1000.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingXl),
            ],
          ),
        ),
      ),
    );
  }
}
