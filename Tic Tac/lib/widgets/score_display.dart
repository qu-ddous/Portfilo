import 'package:flutter/material.dart';
import '../config/constants.dart';

class ScoreDisplay extends StatelessWidget {
  final String playerXName;
  final String playerOName;
  final int playerXScore;
  final int playerOScore;

  const ScoreDisplay({
    super.key,
    required this.playerXName,
    required this.playerOName,
    required this.playerXScore,
    required this.playerOScore,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppConstants.spacingLg),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(AppConstants.radiusLg),
      ),
      child: Row(
        children: [
          // Player X
          Expanded(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppConstants.spacingSm),
                  decoration: BoxDecoration(
                    color: Color(AppConstants.accentRedColor).withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    AppConstants.playerX,
                    style: TextStyle(
                      fontSize: AppConstants.fontH2,
                      fontWeight: FontWeight.w800,
                      color: Color(AppConstants.accentRedColor),
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.spacingSm),
                Text(
                  playerXName,
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppConstants.spacingXs),
                Text(
                  playerXScore.toString(),
                  style: Theme.of(context).textTheme.displayMedium,
                ),
              ],
            ),
          ),

          // Divider
          Container(
            width: 2,
            height: 80,
            color: Colors.grey.withValues(alpha: 0.3),
          ),

          // Player O
          Expanded(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppConstants.spacingSm),
                  decoration: BoxDecoration(
                    color: Color(AppConstants.accentGreenColor).withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    AppConstants.playerO,
                    style: TextStyle(
                      fontSize: AppConstants.fontH2,
                      fontWeight: FontWeight.w800,
                      color: Color(AppConstants.accentGreenColor),
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.spacingSm),
                Text(
                  playerOName,
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: AppConstants.spacingXs),
                Text(
                  playerOScore.toString(),
                  style: Theme.of(context).textTheme.displayMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
