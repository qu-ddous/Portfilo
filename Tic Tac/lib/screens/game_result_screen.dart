import 'package:flutter/material.dart';
import '../models/game_model.dart';
import '../config/constants.dart';

class GameResultScreen extends StatelessWidget {
  final GameModel game;
  final bool isWinner;

  const GameResultScreen({
    super.key,
    required this.game,
    required this.isWinner,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Game Result'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.spacingXl),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isWinner ? Icons.emoji_events : Icons.sentiment_dissatisfied,
                size: 100,
                color: isWinner
                    ? Color(AppConstants.accentGreenColor)
                    : Color(AppConstants.accentRedColor),
              ),
              const SizedBox(height: AppConstants.spacingXl),
              Text(
                isWinner ? 'You Won!' : 'You Lost!',
                style: Theme.of(context).textTheme.displayLarge,
              ),
              const SizedBox(height: AppConstants.spacingMd),
              if (game.duration != null)
                Text(
                  'Duration: ${game.duration!.inSeconds}s',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              const SizedBox(height: AppConstants.spacingXxxl),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Back to Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
