import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/constants.dart';

class PlayerTurnIndicator extends StatelessWidget {
  final String currentPlayer;
  final String playerXName;
  final String playerOName;

  const PlayerTurnIndicator({
    super.key,
    required this.currentPlayer,
    required this.playerXName,
    required this.playerOName,
  });

  @override
  Widget build(BuildContext context) {
    final isPlayerX = currentPlayer == AppConstants.playerX;
    final playerName = isPlayerX ? playerXName : playerOName;
    final color = isPlayerX
        ? Color(AppConstants.accentRedColor)
        : Color(AppConstants.accentGreenColor);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppConstants.spacingLg,
        vertical: AppConstants.spacingMd,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(AppConstants.radiusLg),
        border: Border.all(color: color, width: 2),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(AppConstants.spacingSm),
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
            child: Text(
              currentPlayer,
              style: const TextStyle(
                fontSize: AppConstants.fontH3,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          )
              .animate(onPlay: (controller) => controller.repeat(reverse: true))
              .scale(duration: 1000.ms, begin: const Offset(1, 1), end: const Offset(1.1, 1.1)),
          const SizedBox(width: AppConstants.spacingMd),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Current Turn',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: color,
                    ),
              ),
              Text(
                playerName,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: color,
                      fontWeight: FontWeight.w700,
                    ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
