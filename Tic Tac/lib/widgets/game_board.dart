import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/game_model.dart';
import '../config/constants.dart';
import 'game_tile.dart';

class GameBoard extends StatelessWidget {
  final GameModel game;
  final Function(int row, int col) onTileTap;

  const GameBoard({
    super.key,
    required this.game,
    required this.onTileTap,
  });

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 600;
    final maxBoardSize = isSmallScreen ? size.width - 32 : 500.0;
    final boardSize = maxBoardSize.clamp(280.0, 500.0);
    final tileSize = (boardSize - (game.gridSize + 1) * 8) / game.gridSize;

    return Container(
      width: boardSize,
      height: boardSize,
      padding: const EdgeInsets.all(AppConstants.spacingMd),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).cardColor,
            Theme.of(context).cardColor.withValues(alpha: 0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusXl),
        boxShadow: [
          BoxShadow(
            color: Color(AppConstants.primaryColor).withValues(alpha: 0.2),
            blurRadius: 30,
            spreadRadius: 5,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(
          game.gridSize,
          (row) => Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(
              game.gridSize,
              (col) {
                final index = row * game.gridSize + col;
                final isWinningTile = game.winningLine?.contains(index) ?? false;

                return GameTile(
                  value: game.board[row][col],
                  size: tileSize,
                  isWinningTile: isWinningTile,
                  onTap: () => onTileTap(row, col),
                )
                    .animate()
                    .fadeIn(
                      delay: Duration(milliseconds: 50 * index),
                      duration: 400.ms,
                    )
                    .scale(
                      delay: Duration(milliseconds: 50 * index),
                      duration: 400.ms,
                      begin: const Offset(0.7, 0.7),
                      end: const Offset(1, 1),
                      curve: Curves.easeOutBack,
                    );
              },
            ),
          ),
        ),
      ),
    );
  }
}
