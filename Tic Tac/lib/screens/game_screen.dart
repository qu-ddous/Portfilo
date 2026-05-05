import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../config/constants.dart';
import '../models/game_model.dart';
import '../providers/game_provider.dart';
import '../providers/settings_provider.dart';
import '../services/audio_service.dart';
import '../services/game_service.dart';
import '../services/haptics_service.dart';
import '../widgets/game_board.dart';

class GameScreen extends ConsumerStatefulWidget {
  final String gameMode;
  final int gridSize;
  final String? aiDifficulty;
  final String? roomCode;

  const GameScreen({
    super.key,
    required this.gameMode,
    required this.gridSize,
    this.aiDifficulty,
    this.roomCode,
  });

  @override
  ConsumerState<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends ConsumerState<GameScreen> {
  int _playerXScore = 0;
  int _playerOScore = 0;
  int _turnTimeLeft = 0;
  Timer? _turnTimer;
  bool _autoMoveEnabled = false;

  // Timer durations based on difficulty (in seconds)
  int get _timerDuration {
    if (widget.gameMode == AppConstants.gameModeLocal) {
      return 15; // 15 seconds for local multiplayer
    }
    
    // For AI mode, based on difficulty
    switch (widget.aiDifficulty) {
      case AppConstants.aiEasy:
        return 10; // 10 seconds for easy
      case AppConstants.aiMedium:
        return 15; // 15 seconds for medium
      case AppConstants.aiHard:
        return 20; // 20 seconds for hard
      default:
        return 15;
    }
  }

  @override
  void initState() {
    super.initState();
    // Delay provider modification until after the widget tree is built
    Future.microtask(() {
      _initializeGame();
      _startTurnTimer();
    });
  }

  @override
  void dispose() {
    _turnTimer?.cancel();
    super.dispose();
  }

  void _startTurnTimer() {
    _turnTimer?.cancel();
    setState(() {
      _turnTimeLeft = _timerDuration;
      // Don't reset auto move - let it persist
    });

    _turnTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      final game = ref.read(gameProvider);
      if (game == null || game.isGameOver) {
        timer.cancel();
        return;
      }

      // Don't count down during AI's turn
      if (widget.gameMode == AppConstants.gameModeAI && 
          game.currentPlayer == AppConstants.playerO) {
        return;
      }

      setState(() {
        _turnTimeLeft--;
      });

      // Time's up! Make automatic move if auto is enabled
      if (_turnTimeLeft <= 0) {
        timer.cancel();
        if (_autoMoveEnabled) {
          _makeAutomaticMove();
        }
      }
    });
  }

  void _makeAutomaticMove() async {
    final game = ref.read(gameProvider);
    if (game == null || game.isGameOver) return;

    // Find first available move
    final availableMoves = GameService.getAvailableMoves(game.board);
    if (availableMoves.isNotEmpty) {
      final randomMove = availableMoves[Random().nextInt(availableMoves.length)];
      await _handleMove(randomMove['row']!, randomMove['col']!);
    }
  }

  void _initializeGame() {
    final playerName = ref.read(playerNameProvider);
    ref.read(gameProvider.notifier).createGame(
          gameMode: widget.gameMode,
          gridSize: widget.gridSize,
          aiDifficulty: widget.aiDifficulty,
          playerXName: playerName,
          playerOName: widget.gameMode == AppConstants.gameModeAI
              ? 'AI (${widget.aiDifficulty?.toUpperCase()})'
              : 'Player O',
        );
  }

  Future<void> _handleMove(int row, int col) async {
    final game = ref.read(gameProvider);
    if (game == null || game.isGameOver) return;

    await HapticsService.light();
    await AudioService.playMove();

    await ref.read(gameProvider.notifier).makeMove(row, col);

    // Don't disable auto move - let user control it manually
    // User can toggle it off if they want

    // Restart timer for next turn
    _startTurnTimer();

    // Check if game ended
    final updatedGame = ref.read(gameProvider);
    if (updatedGame != null && updatedGame.isGameOver) {
      _turnTimer?.cancel();
      await _handleGameEnd(updatedGame.winner, updatedGame.isDraw);
    }
  }

  Future<void> _handleGameEnd(String? winner, bool isDraw) async {
    await Future.delayed(const Duration(milliseconds: 500));

    if (isDraw) {
      await AudioService.playDraw();
      await HapticsService.medium();
    } else if (winner != null) {
      final isPlayerWin = (winner == AppConstants.playerX);

      if (isPlayerWin) {
        setState(() => _playerXScore++);
        await AudioService.playWin();
        await HapticsService.success();
      } else {
        setState(() => _playerOScore++);
        if (widget.gameMode == AppConstants.gameModeAI) {
          await AudioService.playLose();
        } else {
          await AudioService.playWin();
        }
        await HapticsService.success();
      }
    }

    // Show result dialog
    if (mounted) {
      _showResultDialog();
    }
  }

  void _showResultDialog() {
    final game = ref.read(gameProvider);
    if (game == null) return;

    String title;
    String message;
    String emoji;
    Color color;

    if (game.isDraw) {
      title = 'It\'s a Draw!';
      message = 'Well played by both sides!';
      emoji = '🤝';
      color = Colors.orange;
    } else if (game.winner == AppConstants.playerX) {
      title = 'Victory!';
      message = '${game.playerXName} wins the game!';
      emoji = '🏆';
      color = Color(AppConstants.accentGreenColor);
    } else {
      title = widget.gameMode == AppConstants.gameModeAI ? 'AI Wins!' : 'Victory!';
      message = '${game.playerOName} wins the game!';
      emoji = '🏆';
      color = Color(AppConstants.accentRedColor);
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black.withValues(alpha: 0.7),
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusXl),
        ),
        elevation: 0,
        backgroundColor: Colors.transparent,
        child: Container(
          padding: EdgeInsets.all(AppConstants.spacingXxl),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).cardColor,
                Theme.of(context).cardColor.withValues(alpha: 0.95),
              ],
            ),
            borderRadius: BorderRadius.circular(AppConstants.radiusXl),
            border: Border.all(
              color: color.withValues(alpha: 0.5),
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.3),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Emoji Icon
              Container(
                padding: EdgeInsets.all(AppConstants.spacingXl),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      color.withValues(alpha: 0.3),
                      color.withValues(alpha: 0.1),
                    ],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: color.withValues(alpha: 0.4),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: Text(
                  emoji,
                  style: TextStyle(fontSize: 64),
                ),
              )
                  .animate()
                  .scale(
                    duration: 600.ms,
                    curve: Curves.elasticOut,
                  )
                  .shimmer(duration: 1500.ms),

              SizedBox(height: AppConstants.spacingXl),

              // Title
              Text(
                title,
                style: TextStyle(
                  fontSize: AppConstants.fontH2,
                  fontWeight: FontWeight.w900,
                  color: color,
                  shadows: [
                    Shadow(
                      color: color.withValues(alpha: 0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ).animate().fadeIn(delay: 200.ms).slideY(begin: -0.2, end: 0),

              SizedBox(height: AppConstants.spacingMd),

              // Message
              Text(
                message,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.8),
                    ),
                textAlign: TextAlign.center,
              ).animate().fadeIn(delay: 300.ms),

              if (game.duration != null) ...[
                SizedBox(height: AppConstants.spacingLg),
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: AppConstants.spacingLg,
                    vertical: AppConstants.spacingMd,
                  ),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                    border: Border.all(
                      color: color.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.timer, color: color, size: 20),
                      SizedBox(width: AppConstants.spacingSm),
                      Text(
                        'Duration: ${game.duration!.inSeconds}s',
                        style: TextStyle(
                          fontSize: AppConstants.fontBody,
                          fontWeight: FontWeight.w600,
                          color: color,
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 400.ms).scale(delay: 400.ms),
              ],

              SizedBox(height: AppConstants.spacingXxl),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: _buildDialogButton(
                      context,
                      label: 'Exit',
                      icon: Icons.exit_to_app_rounded,
                      color: Colors.grey,
                      onPressed: () {
                        Navigator.of(context).pop();
                        Navigator.of(context).pop();
                      },
                    ),
                  ),
                  SizedBox(width: AppConstants.spacingMd),
                  Expanded(
                    child: _buildDialogButton(
                      context,
                      label: 'Play Again',
                      icon: Icons.refresh_rounded,
                      color: color,
                      onPressed: () {
                        Navigator.of(context).pop();
                        _restartGame();
                      },
                    ),
                  ),
                ],
              ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2, end: 0),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDialogButton(
    BuildContext context, {
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color, color.withValues(alpha: 0.8)],
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusLg),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: AppConstants.spacingLg),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: Colors.white, size: 20),
                SizedBox(width: AppConstants.spacingSm),
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: AppConstants.fontBody,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showExitDialog() {
    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.7),
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusXl),
        ),
        elevation: 0,
        backgroundColor: Colors.transparent,
        child: Container(
          padding: EdgeInsets.all(AppConstants.spacingXxl),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Theme.of(context).cardColor,
                Theme.of(context).cardColor.withValues(alpha: 0.95),
              ],
            ),
            borderRadius: BorderRadius.circular(AppConstants.radiusXl),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: EdgeInsets.all(AppConstants.spacingLg),
                decoration: BoxDecoration(
                  color: Color(AppConstants.accentRedColor).withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.warning_rounded,
                  color: Color(AppConstants.accentRedColor),
                  size: 48,
                ),
              ),
              SizedBox(height: AppConstants.spacingXl),
              Text(
                'Exit Game?',
                style: TextStyle(
                  fontSize: AppConstants.fontH2,
                  fontWeight: FontWeight.w800,
                  color: Color(AppConstants.accentRedColor),
                ),
              ),
              SizedBox(height: AppConstants.spacingMd),
              Text(
                'Are you sure you want to exit?\nCurrent game progress will be lost.',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: AppConstants.spacingXxl),
              Row(
                children: [
                  Expanded(
                    child: _buildDialogButton(
                      context,
                      label: 'Cancel',
                      icon: Icons.close_rounded,
                      color: Colors.grey,
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                  SizedBox(width: AppConstants.spacingMd),
                  Expanded(
                    child: _buildDialogButton(
                      context,
                      label: 'Exit',
                      icon: Icons.exit_to_app_rounded,
                      color: Color(AppConstants.accentRedColor),
                      onPressed: () {
                        Navigator.of(context).pop();
                        Navigator.of(context).pop();
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _restartGame() {
    ref.read(gameProvider.notifier).resetGame();
    _startTurnTimer();
  }

  @override
  Widget build(BuildContext context) {
    final game = ref.watch(gameProvider);
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 600;

    if (game == null) {
      return Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(AppConstants.primaryColor),
                Color(AppConstants.primaryDarkColor),
              ],
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
                SizedBox(height: AppConstants.spacingXl),
                Text(
                  'Loading Game...',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: AppConstants.fontH3,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Theme.of(context).brightness == Brightness.dark
                  ? Color(0xFF0F172A)
                  : Color(0xFFF8FAFC),
              Theme.of(context).brightness == Brightness.dark
                  ? Color(0xFF1E293B)
                  : Color(0xFFE0E7FF),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Premium Header Bar
              _buildPremiumHeader(context, game, isSmallScreen)
                  .animate()
                  .fadeIn(duration: 400.ms)
                  .slideY(begin: -0.3, end: 0),

              // Main Content - Scrollable
              Expanded(
                child: SingleChildScrollView(
                  physics: BouncingScrollPhysics(),
                  padding: EdgeInsets.symmetric(
                    horizontal: isSmallScreen ? AppConstants.spacingLg : AppConstants.spacingXxl,
                    vertical: AppConstants.spacingLg,
                  ),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: 800),
                      child: Column(
                        children: [
                          // Score Display with Premium Cards
                          _buildPremiumScoreDisplay(context, game, isSmallScreen)
                              .animate()
                              .fadeIn(delay: 100.ms, duration: 400.ms)
                              .slideY(begin: -0.2, end: 0),

                          SizedBox(height: isSmallScreen ? AppConstants.spacingXl : AppConstants.spacingXxl),

                          // Turn Indicator or Winner Banner
                          if (!game.isGameOver)
                            _buildTurnIndicator(context, game, isSmallScreen)
                                .animate()
                                .fadeIn(delay: 200.ms, duration: 400.ms)
                                .shimmer(duration: 2000.ms, color: Colors.white.withValues(alpha: 0.3)),

                          if (game.isGameOver)
                            _buildWinnerBanner(context, game, isSmallScreen)
                                .animate()
                                .fadeIn(duration: 400.ms)
                                .scale(begin: Offset(0.8, 0.8))
                                .shimmer(duration: 1500.ms, color: Colors.white.withValues(alpha: 0.5)),

                          SizedBox(height: isSmallScreen ? AppConstants.spacingXl : AppConstants.spacingXxl),

                          // Premium Game Board
                          GameBoard(
                            game: game,
                            onTileTap: _handleMove,
                          )
                              .animate()
                              .fadeIn(delay: 300.ms, duration: 600.ms)
                              .scale(begin: Offset(0.85, 0.85), end: Offset(1, 1))
                              .shimmer(delay: 600.ms, duration: 1500.ms, color: Colors.white.withValues(alpha: 0.1)),

                          SizedBox(height: isSmallScreen ? AppConstants.spacingXl : AppConstants.spacingXxl),

                          // Premium Action Buttons
                          _buildActionButtons(context, isSmallScreen)
                              .animate()
                              .fadeIn(delay: 400.ms, duration: 400.ms)
                              .slideY(begin: 0.2, end: 0),

                          SizedBox(height: AppConstants.spacingXl),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPremiumHeader(BuildContext context, GameModel game, bool isSmallScreen) {
    // Calculate timer color based on time left
    Color timerColor = Colors.white;
    if (_turnTimeLeft <= 5) {
      timerColor = Color(AppConstants.accentRedColor);
    } else if (_turnTimeLeft <= 10) {
      timerColor = Colors.orange;
    }

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isSmallScreen ? AppConstants.spacingLg : AppConstants.spacingXxl,
        vertical: AppConstants.spacingLg,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(AppConstants.primaryColor),
            Color(AppConstants.primaryDarkColor),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Color(AppConstants.primaryColor).withValues(alpha: 0.3),
            blurRadius: 20,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Back Button
          Container(
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(AppConstants.radiusLg),
            ),
            child: IconButton(
              icon: Icon(Icons.arrow_back_ios_new, color: Colors.white),
              onPressed: _showExitDialog,
            ),
          ),
          SizedBox(width: AppConstants.spacingLg),
          // Title
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.gameMode == AppConstants.gameModeAI
                      ? '🤖 VS AI'
                      : widget.gameMode == AppConstants.gameModeLocal
                          ? '👥 Local Game'
                          : '🌐 Online Game',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: isSmallScreen ? AppConstants.fontH3 : AppConstants.fontH2,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
                if (widget.aiDifficulty != null)
                  Text(
                    'Difficulty: ${widget.aiDifficulty!.toUpperCase()}',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8),
                      fontSize: AppConstants.fontBodySmall,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
              ],
            ),
          ),
          // Turn Timer
          if (!game.isGameOver)
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: AppConstants.spacingLg,
                vertical: AppConstants.spacingSm,
              ),
              decoration: BoxDecoration(
                color: _turnTimeLeft <= 5 
                    ? Color(AppConstants.accentRedColor).withValues(alpha: 0.3)
                    : Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                border: Border.all(
                  color: timerColor,
                  width: 2,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.timer,
                    color: timerColor,
                    size: isSmallScreen ? 16 : 20,
                  ),
                  SizedBox(width: AppConstants.spacingSm),
                  Text(
                    '${_turnTimeLeft}s',
                    style: TextStyle(
                      color: timerColor,
                      fontSize: isSmallScreen ? AppConstants.fontBody : AppConstants.fontBodyLarge,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            )
                .animate(
                  onPlay: (controller) => controller.repeat(),
                )
                .shake(
                  duration: 500.ms,
                  hz: _turnTimeLeft <= 5 ? 4 : 0,
                ),
          // Game Duration (when game is over)
          if (game.isGameOver && game.duration != null)
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: AppConstants.spacingLg,
                vertical: AppConstants.spacingSm,
              ),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(AppConstants.radiusFull),
              ),
              child: Row(
                children: [
                  Icon(Icons.timer, color: Colors.white, size: 16),
                  SizedBox(width: AppConstants.spacingSm),
                  Text(
                    '${game.duration!.inSeconds}s',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: AppConstants.fontBody,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildPremiumScoreDisplay(BuildContext context, GameModel game, bool isSmallScreen) {
    return Row(
      children: [
        // Player X Card
        Expanded(
          child: _buildPlayerCard(
            context,
            game.playerXName ?? 'Player X',
            _playerXScore,
            AppConstants.playerX,
            Color(AppConstants.accentGreenColor),
            game.currentPlayer == AppConstants.playerX && !game.isGameOver,
            isSmallScreen,
          ),
        ),
        SizedBox(width: AppConstants.spacingLg),
        // VS Badge
        Container(
          padding: EdgeInsets.all(isSmallScreen ? AppConstants.spacingMd : AppConstants.spacingLg),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color(AppConstants.primaryColor),
                Color(AppConstants.primaryDarkColor),
              ],
            ),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: Color(AppConstants.primaryColor).withValues(alpha: 0.4),
                blurRadius: 15,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Text(
            'VS',
            style: TextStyle(
              color: Colors.white,
              fontSize: isSmallScreen ? AppConstants.fontBody : AppConstants.fontBodyLarge,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
        SizedBox(width: AppConstants.spacingLg),
        // Player O Card
        Expanded(
          child: _buildPlayerCard(
            context,
            game.playerOName ?? 'Player O',
            _playerOScore,
            AppConstants.playerO,
            Color(AppConstants.accentRedColor),
            game.currentPlayer == AppConstants.playerO && !game.isGameOver,
            isSmallScreen,
          ),
        ),
      ],
    );
  }

  Widget _buildPlayerCard(
    BuildContext context,
    String name,
    int score,
    String symbol,
    Color color,
    bool isActive,
    bool isSmallScreen,
  ) {
    final game = ref.watch(gameProvider);
    final shouldShowAutoButton = isActive && 
                                  game != null && 
                                  !game.isGameOver &&
                                  // Don't show auto button for AI player
                                  !(widget.gameMode == AppConstants.gameModeAI && symbol == AppConstants.playerO);

    return Container(
      padding: EdgeInsets.all(isSmallScreen ? AppConstants.spacingMd : AppConstants.spacingLg),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isActive
              ? [color.withValues(alpha: 0.2), color.withValues(alpha: 0.1)]
              : [
                  Theme.of(context).cardColor,
                  Theme.of(context).cardColor.withValues(alpha: 0.8),
                ],
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusXl),
        border: Border.all(
          color: isActive ? color : Colors.transparent,
          width: 3,
        ),
        boxShadow: [
          BoxShadow(
            color: isActive ? color.withValues(alpha: 0.3) : Colors.black.withValues(alpha: 0.1),
            blurRadius: isActive ? 20 : 10,
            spreadRadius: isActive ? 2 : 0,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            symbol,
            style: TextStyle(
              fontSize: isSmallScreen ? 32 : 40,
              fontWeight: FontWeight.w900,
              color: color,
              shadows: [
                Shadow(
                  color: color.withValues(alpha: 0.5),
                  blurRadius: 10,
                ),
              ],
            ),
          ),
          SizedBox(height: AppConstants.spacingSm),
          Text(
            name,
            style: TextStyle(
              fontSize: isSmallScreen ? AppConstants.fontBodySmall : AppConstants.fontBody,
              fontWeight: FontWeight.w600,
              color: Theme.of(context).textTheme.bodyMedium?.color,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          SizedBox(height: AppConstants.spacingXs),
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: AppConstants.spacingMd,
              vertical: AppConstants.spacingXs,
            ),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(AppConstants.radiusFull),
            ),
            child: Text(
              'Score: $score',
              style: TextStyle(
                fontSize: AppConstants.fontBodySmall,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ),
          // Auto Button
          if (shouldShowAutoButton) ...[
            SizedBox(height: AppConstants.spacingMd),
            GestureDetector(
              onTap: () {
                setState(() {
                  _autoMoveEnabled = !_autoMoveEnabled;
                });
                HapticsService.light();
              },
              child: Container(
                padding: EdgeInsets.symmetric(
                  horizontal: AppConstants.spacingMd,
                  vertical: AppConstants.spacingSm,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _autoMoveEnabled
                        ? [color, color.withValues(alpha: 0.8)]
                        : [
                            Colors.grey.withValues(alpha: 0.3),
                            Colors.grey.withValues(alpha: 0.2),
                          ],
                  ),
                  borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                  border: Border.all(
                    color: _autoMoveEnabled ? color : Colors.grey,
                    width: 2,
                  ),
                  boxShadow: _autoMoveEnabled
                      ? [
                          BoxShadow(
                            color: color.withValues(alpha: 0.4),
                            blurRadius: 10,
                            spreadRadius: 1,
                          ),
                        ]
                      : [],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _autoMoveEnabled ? Icons.check_circle : Icons.circle_outlined,
                      color: _autoMoveEnabled ? Colors.white : Colors.grey,
                      size: 16,
                    ),
                    SizedBox(width: AppConstants.spacingXs),
                    Text(
                      'Auto',
                      style: TextStyle(
                        fontSize: AppConstants.fontBodySmall,
                        fontWeight: FontWeight.w700,
                        color: _autoMoveEnabled ? Colors.white : Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
            )
                .animate(
                  target: _autoMoveEnabled ? 1 : 0,
                )
                .scale(duration: 200.ms)
                .shimmer(
                  duration: 1500.ms,
                  color: _autoMoveEnabled ? Colors.white.withValues(alpha: 0.5) : Colors.transparent,
                ),
          ],
        ],
      ),
    );
  }

  Widget _buildTurnIndicator(BuildContext context, GameModel game, bool isSmallScreen) {
    final isPlayerX = game.currentPlayer == AppConstants.playerX;
    final color = isPlayerX ? Color(AppConstants.accentGreenColor) : Color(AppConstants.accentRedColor);
    final playerName = isPlayerX ? game.playerXName : game.playerOName;

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isSmallScreen ? AppConstants.spacingLg : AppConstants.spacingXxl,
        vertical: isSmallScreen ? AppConstants.spacingMd : AppConstants.spacingLg,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.2),
            color.withValues(alpha: 0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusFull),
        border: Border.all(color: color, width: 2),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.3),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: EdgeInsets.all(AppConstants.spacingSm),
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
            child: Text(
              game.currentPlayer,
              style: TextStyle(
                color: Colors.white,
                fontSize: isSmallScreen ? AppConstants.fontBodyLarge : AppConstants.fontH3,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          SizedBox(width: AppConstants.spacingMd),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Current Turn',
                style: TextStyle(
                  fontSize: AppConstants.fontBodySmall,
                  fontWeight: FontWeight.w500,
                  color: Theme.of(context).textTheme.bodySmall?.color,
                ),
              ),
              Text(
                playerName ?? 'Player',
                style: TextStyle(
                  fontSize: isSmallScreen ? AppConstants.fontBodyLarge : AppConstants.fontH3,
                  fontWeight: FontWeight.w700,
                  color: color,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWinnerBanner(BuildContext context, GameModel game, bool isSmallScreen) {
    final color = game.isDraw
        ? Colors.orange
        : game.winner == AppConstants.playerX
            ? Color(AppConstants.accentGreenColor)
            : Color(AppConstants.accentRedColor);

    final icon = game.isDraw ? '🤝' : '🏆';
    final title = game.isDraw
        ? 'It\'s a Draw!'
        : '${game.winner == AppConstants.playerX ? game.playerXName : game.playerOName} Wins!';

    return Container(
      padding: EdgeInsets.all(isSmallScreen ? AppConstants.spacingLg : AppConstants.spacingXxl),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.3),
            color.withValues(alpha: 0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusXl),
        border: Border.all(color: color, width: 3),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.4),
            blurRadius: 30,
            spreadRadius: 5,
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            icon,
            style: TextStyle(fontSize: isSmallScreen ? 48 : 64),
          ),
          SizedBox(height: AppConstants.spacingMd),
          Text(
            title,
            style: TextStyle(
              fontSize: isSmallScreen ? AppConstants.fontH2 : AppConstants.fontH1,
              fontWeight: FontWeight.w900,
              color: color,
              shadows: [
                Shadow(
                  color: color.withValues(alpha: 0.5),
                  blurRadius: 15,
                ),
              ],
            ),
            textAlign: TextAlign.center,
          ),
          if (game.duration != null) ...[
            SizedBox(height: AppConstants.spacingMd),
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: AppConstants.spacingLg,
                vertical: AppConstants.spacingSm,
              ),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(AppConstants.radiusFull),
              ),
              child: Text(
                '⏱️ ${game.duration!.inSeconds} seconds',
                style: TextStyle(
                  fontSize: AppConstants.fontBody,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, bool isSmallScreen) {
    return Row(
      children: [
        Expanded(
          child: _buildPremiumButton(
            context,
            icon: Icons.refresh_rounded,
            label: 'Restart',
            color: Color(AppConstants.primaryColor),
            onPressed: _restartGame,
            isSmallScreen: isSmallScreen,
          ),
        ),
        SizedBox(width: AppConstants.spacingLg),
        Expanded(
          child: _buildPremiumButton(
            context,
            icon: Icons.exit_to_app_rounded,
            label: 'Exit',
            color: Color(AppConstants.accentRedColor),
            onPressed: _showExitDialog,
            isSmallScreen: isSmallScreen,
          ),
        ),
      ],
    );
  }

  Widget _buildPremiumButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onPressed,
    required bool isSmallScreen,
  }) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color, color.withValues(alpha: 0.8)],
        ),
        borderRadius: BorderRadius.circular(AppConstants.radiusXl),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.4),
            blurRadius: 15,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(AppConstants.radiusXl),
          child: Padding(
            padding: EdgeInsets.symmetric(
              vertical: isSmallScreen ? AppConstants.spacingLg : AppConstants.spacingXl,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: Colors.white, size: isSmallScreen ? 20 : 24),
                SizedBox(width: AppConstants.spacingSm),
                Text(
                  label,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: isSmallScreen ? AppConstants.fontBody : AppConstants.fontBodyLarge,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
