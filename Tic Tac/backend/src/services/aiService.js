const { PLAYER_X, PLAYER_O, AI_EASY, AI_MEDIUM, AI_HARD } = require('../config/constants');
const GameService = require('./gameService');

class AIService {
  static getAIMove(board, difficulty, aiPlayer) {
    switch (difficulty) {
      case AI_EASY:
        return this.getRandomMove(board);
      case AI_MEDIUM:
        return this.getMediumMove(board, aiPlayer);
      case AI_HARD:
        return this.getHardMove(board, aiPlayer);
      default:
        return this.getRandomMove(board);
    }
  }

  static getRandomMove(board) {
    const availableMoves = GameService.getAvailableMoves(board);
    if (availableMoves.length === 0) return null;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  static getMediumMove(board, aiPlayer) {
    const opponent = aiPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

    // Try to win
    const winMove = this.findWinningMove(board, aiPlayer);
    if (winMove) return winMove;

    // Block opponent
    const blockMove = this.findWinningMove(board, opponent);
    if (blockMove) return blockMove;

    // Random move
    return this.getRandomMove(board);
  }

  static getHardMove(board, aiPlayer) {
    const opponent = aiPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    let bestScore = -Infinity;
    let bestMove = null;

    const availableMoves = GameService.getAvailableMoves(board);

    for (const move of availableMoves) {
      const newBoard = board.map(row => [...row]);
      newBoard[move.row][move.col] = aiPlayer;

      const score = this.minimax(newBoard, 0, false, aiPlayer, opponent);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove || this.getRandomMove(board);
  }

  static minimax(board, depth, isMaximizing, aiPlayer, opponent) {
    const gridSize = board.length;
    const winner = GameService.checkWinner(board, gridSize);

    // Terminal states
    if (winner === aiPlayer) return 10 - depth;
    if (winner === opponent) return depth - 10;
    if (GameService.isBoardFull(board)) return 0;

    // Depth limit for performance
    if (depth >= 6) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      const availableMoves = GameService.getAvailableMoves(board);

      for (const move of availableMoves) {
        const newBoard = board.map(row => [...row]);
        newBoard[move.row][move.col] = aiPlayer;

        const score = this.minimax(newBoard, depth + 1, false, aiPlayer, opponent);
        bestScore = Math.max(bestScore, score);
      }

      return bestScore;
    } else {
      let bestScore = Infinity;
      const availableMoves = GameService.getAvailableMoves(board);

      for (const move of availableMoves) {
        const newBoard = board.map(row => [...row]);
        newBoard[move.row][move.col] = opponent;

        const score = this.minimax(newBoard, depth + 1, true, aiPlayer, opponent);
        bestScore = Math.min(bestScore, score);
      }

      return bestScore;
    }
  }

  static findWinningMove(board, player) {
    const availableMoves = GameService.getAvailableMoves(board);

    for (const move of availableMoves) {
      const newBoard = board.map(row => [...row]);
      newBoard[move.row][move.col] = player;

      if (GameService.checkWinner(newBoard, board.length) === player) {
        return move;
      }
    }

    return null;
  }
}

module.exports = AIService;
