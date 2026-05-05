import 'package:flutter/material.dart';
import '../config/constants.dart';

class GameStatsCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color? color;

  const GameStatsCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final cardColor = color ?? Color(AppConstants.primaryColor);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingLg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 32,
              color: cardColor,
            ),
            const SizedBox(height: AppConstants.spacingSm),
            Text(
              value,
              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                    color: cardColor,
                  ),
            ),
            const SizedBox(height: AppConstants.spacingXs),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey,
                  ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
