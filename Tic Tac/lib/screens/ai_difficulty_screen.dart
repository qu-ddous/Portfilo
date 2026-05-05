import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/constants.dart';
import '../config/routes.dart';
import '../providers/settings_provider.dart';
import '../services/haptics_service.dart';

class AIDifficultyScreen extends ConsumerWidget {
  const AIDifficultyScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gridSizePreference = ref.watch(gridSizePreferenceProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Difficulty'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.spacingXl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: AppConstants.spacingXl),

              Text(
                'Choose AI Difficulty',
                style: Theme.of(context).textTheme.displayMedium,
                textAlign: TextAlign.center,
              ).animate().fadeIn(duration: 400.ms),

              const SizedBox(height: AppConstants.spacingSm),

              Text(
                'Select how challenging you want the AI opponent to be',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey,
                    ),
                textAlign: TextAlign.center,
              ).animate().fadeIn(delay: 200.ms, duration: 400.ms),

              const Spacer(),

              // Easy Difficulty
              _DifficultyCard(
                title: 'Easy',
                description: 'Perfect for beginners. AI makes random moves.',
                icon: Icons.sentiment_satisfied,
                color: Color(AppConstants.accentGreenColor),
                onTap: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(
                    AppRoutes.game,
                    arguments: {
                      'gameMode': AppConstants.gameModeAI,
                      'gridSize': gridSizePreference,
                      'aiDifficulty': AppConstants.aiEasy,
                    },
                  );
                },
              ).animate().fadeIn(delay: 400.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingLg),

              // Medium Difficulty
              _DifficultyCard(
                title: 'Medium',
                description: 'Balanced challenge. AI blocks and tries to win.',
                icon: Icons.sentiment_neutral,
                color: Colors.orange,
                onTap: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(
                    AppRoutes.game,
                    arguments: {
                      'gameMode': AppConstants.gameModeAI,
                      'gridSize': gridSizePreference,
                      'aiDifficulty': AppConstants.aiMedium,
                    },
                  );
                },
              ).animate().fadeIn(delay: 500.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const SizedBox(height: AppConstants.spacingLg),

              // Hard Difficulty
              _DifficultyCard(
                title: 'Hard',
                description: 'Unbeatable! AI uses advanced minimax algorithm.',
                icon: Icons.sentiment_very_dissatisfied,
                color: Color(AppConstants.accentRedColor),
                onTap: () {
                  HapticsService.medium();
                  Navigator.of(context).pushNamed(
                    AppRoutes.game,
                    arguments: {
                      'gameMode': AppConstants.gameModeAI,
                      'gridSize': gridSizePreference,
                      'aiDifficulty': AppConstants.aiHard,
                    },
                  );
                },
              ).animate().fadeIn(delay: 600.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}

class _DifficultyCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _DifficultyCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppConstants.radiusLg),
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.spacingLg),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(AppConstants.radiusMd),
                ),
                child: Icon(
                  icon,
                  size: 32,
                  color: color,
                ),
              ),
              const SizedBox(width: AppConstants.spacingLg),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: AppConstants.spacingXs),
                    Text(
                      description,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey,
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                size: 20,
                color: Colors.grey,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
