import 'package:flutter/material.dart';
import '../config/constants.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Mock data for demonstration
    final leaderboard = List.generate(
      10,
      (index) => {
        'rank': index + 1,
        'name': 'Player ${index + 1}',
        'wins': 50 - (index * 5),
        'winRate': (90 - (index * 5)).toDouble(),
      },
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Leaderboard'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(AppConstants.spacingLg),
        itemCount: leaderboard.length,
        itemBuilder: (context, index) {
          final player = leaderboard[index];
          final rank = player['rank'] as int;
          final name = player['name'] as String;
          final wins = player['wins'] as int;
          final winRate = player['winRate'] as double;

          return Card(
            margin: const EdgeInsets.only(bottom: AppConstants.spacingMd),
            child: ListTile(
              leading: _buildRankBadge(rank),
              title: Text(
                name,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              subtitle: Text('$wins wins'),
              trailing: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacingMd,
                  vertical: AppConstants.spacingSm,
                ),
                decoration: BoxDecoration(
                  color: Color(AppConstants.accentGreenColor).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(AppConstants.radiusMd),
                ),
                child: Text(
                  '${winRate.toStringAsFixed(1)}%',
                  style: TextStyle(
                    color: Color(AppConstants.accentGreenColor),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRankBadge(int rank) {
    Color color;
    IconData? icon;

    if (rank == 1) {
      color = const Color(0xFFFFD700); // Gold
      icon = Icons.emoji_events;
    } else if (rank == 2) {
      color = const Color(0xFFC0C0C0); // Silver
      icon = Icons.emoji_events;
    } else if (rank == 3) {
      color = const Color(0xFFCD7F32); // Bronze
      icon = Icons.emoji_events;
    } else {
      color = Colors.grey;
    }

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        shape: BoxShape.circle,
      ),
      child: Center(
        child: icon != null
            ? Icon(icon, color: color, size: 24)
            : Text(
                '$rank',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: color,
                ),
              ),
      ),
    );
  }
}
