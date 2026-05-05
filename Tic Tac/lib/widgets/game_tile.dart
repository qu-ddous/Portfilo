import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/constants.dart';

class GameTile extends StatelessWidget {
  final String value;
  final double size;
  final bool isWinningTile;
  final VoidCallback onTap;

  const GameTile({
    super.key,
    required this.value,
    required this.size,
    this.isWinningTile = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isEmpty = value.isEmpty;

    return GestureDetector(
      onTap: isEmpty ? onTap : null,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        width: size,
        height: size,
        decoration: BoxDecoration(
          gradient: isWinningTile
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(AppConstants.accentGreenColor).withValues(alpha: 0.4),
                    Color(AppConstants.accentGreenColor).withValues(alpha: 0.2),
                  ],
                )
              : LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isDark
                      ? [Color(0xFF1E293B), Color(0xFF0F172A)]
                      : [Colors.white, Color(0xFFF8FAFC)],
                ),
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          border: Border.all(
            color: isWinningTile
                ? Color(AppConstants.accentGreenColor)
                : isEmpty
                    ? (isDark ? Color(0xFF334155) : Color(AppConstants.borderColor))
                    : _getSymbolColor().withValues(alpha: 0.5),
            width: isWinningTile ? 3 : 2,
          ),
          boxShadow: [
            if (!isEmpty)
              BoxShadow(
                color: _getSymbolColor().withValues(alpha: 0.4),
                blurRadius: 15,
                spreadRadius: 1,
                offset: const Offset(0, 4),
              ),
            BoxShadow(
              color: isWinningTile
                  ? Color(AppConstants.accentGreenColor).withValues(alpha: 0.3)
                  : Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Center(
          child: isEmpty
              ? Icon(
                  Icons.add,
                  color: (isDark ? Colors.white : Colors.black).withValues(alpha: 0.1),
                  size: size * 0.3,
                )
              : Container(
                  padding: EdgeInsets.all(size * 0.1),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        _getSymbolColor().withValues(alpha: 0.2),
                        _getSymbolColor().withValues(alpha: 0.0),
                      ],
                    ),
                  ),
                  child: Text(
                    value,
                    style: TextStyle(
                      fontSize: size * 0.55,
                      fontWeight: FontWeight.w900,
                      color: _getSymbolColor(),
                      shadows: [
                        Shadow(
                          color: _getSymbolColor().withValues(alpha: 0.5),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                  ),
                )
                    .animate()
                    .fadeIn(duration: 200.ms)
                    .scale(
                      duration: 400.ms,
                      curve: Curves.elasticOut,
                      begin: const Offset(0, 0),
                      end: const Offset(1, 1),
                    )
                    .shimmer(
                      delay: 200.ms,
                      duration: 1000.ms,
                      color: Colors.white.withValues(alpha: 0.3),
                    ),
        ),
      ),
    );
  }

  Color _getSymbolColor() {
    if (value == AppConstants.playerX) {
      return Color(AppConstants.accentGreenColor);
    } else if (value == AppConstants.playerO) {
      return Color(AppConstants.accentRedColor);
    }
    return Colors.grey;
  }
}
