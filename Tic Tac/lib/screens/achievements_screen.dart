import 'package:flutter/material.dart';
import '../config/constants.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Achievements'),
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(AppConstants.spacingLg),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: AppConstants.spacingMd,
          mainAxisSpacing: AppConstants.spacingMd,
          childAspectRatio: 0.85,
        ),
        itemCount: AppConstants.achievements.length,
        itemBuilder: (context, index) {
          final achievement = AppConstants.achievements[index];
          final isUnlocked = index < 3; // Mock: first 3 are unlocked

          return Card(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.spacingMd),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    achievement['icon']!,
                    style: TextStyle(
                      fontSize: 48,
                      color: isUnlocked ? null : Colors.grey,
                    ),
                  ),
                  const SizedBox(height: AppConstants.spacingMd),
                  Text(
                    achievement['name']!,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: isUnlocked ? null : Colors.grey,
                        ),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppConstants.spacingSm),
                  Text(
                    achievement['description']!,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey,
                        ),
                    textAlign: TextAlign.center,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (!isUnlocked) ...[
                    const SizedBox(height: AppConstants.spacingSm),
                    Icon(
                      Icons.lock,
                      size: 20,
                      color: Colors.grey,
                    ),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
