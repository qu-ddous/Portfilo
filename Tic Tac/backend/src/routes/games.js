const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const GameService = require('../services/gameService');
const AIService = require('../services/aiService');
const { PLAYER_X, PLAYER_O, STATUS_PLAYING, STATUS_WON, STATUS_DRAW, GAME_MODE_AI } = require('../config/constants');

// Create game
router.post('/create', authMiddleware, async (req, res, next) => {
  try {
    const { gameMode, gridSize, aiDifficulty } = req.body;
    const gameId = uuidv4();
    const board = GameService.createEmptyBoard(gridSize || 3);

    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO games (id, game_mode, grid_size, status, player_x_id, board, current_player, ai_difficulty) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [gameId, gameMode, gridSize || 3, STATUS_PLAYING, req.userId, JSON.stringify(board), PLAYER_X, aiDifficulty],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(201).json({
      id: gameId,
      gameMode,
      gridSize: gridSize || 3,
      status: STATUS_PLAYING,
      board,
      currentPlayer: PLAYER_X,
      aiDifficulty,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Make move
router.post('/:gameId/move', authMiddleware, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { row, col, player } = req.body;

    // Get game
    const game = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const board = JSON.parse(game.board);

    // Validate move
    if (!GameService.isValidMove(board, row, col)) {
      return res.status(400).json({ error: 'Invalid move' });
    }

    // Make move
    board[row][col] = player;

    // Check winner
    const winner = GameService.checkWinner(board, game.grid_size);
    const winningLine = winner ? GameService.getWinningLine(board, game.grid_size) : null;
    const isDraw = !winner && GameService.isBoardFull(board);

    const newStatus = winner ? STATUS_WON : (isDraw ? STATUS_DRAW : STATUS_PLAYING);
    const nextPlayer = player === PLAYER_X ? PLAYER_O : PLAYER_X;

    // Update game
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE games SET board = ?, current_player = ?, winner = ?, winning_line = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [JSON.stringify(board), nextPlayer, winner, JSON.stringify(winningLine), newStatus, gameId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const response = {
      game: {
        id: gameId,
        board,
        currentPlayer: nextPlayer,
        winner,
        winningLine,
        status: newStatus
      }
    };

    // AI move if needed
    if (game.game_mode === GAME_MODE_AI && newStatus === STATUS_PLAYING && nextPlayer === PLAYER_O) {
      const aiMove = AIService.getAIMove(board, game.ai_difficulty, PLAYER_O);
      if (aiMove) {
        response.aiMove = aiMove;
      }
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get game
router.get('/:gameId', authMiddleware, async (req, res, next) => {
  try {
    const { gameId } = req.params;

    const game = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({
      id: game.id,
      gameMode: game.game_mode,
      gridSize: game.grid_size,
      status: game.status,
      board: JSON.parse(game.board),
      currentPlayer: game.current_player,
      winner: game.winner,
      winningLine: game.winning_line ? JSON.parse(game.winning_line) : null,
      aiDifficulty: game.ai_difficulty,
      createdAt: game.created_at,
      endedAt: game.ended_at
    });
  } catch (error) {
    next(error);
  }
});

// Get game history
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const games = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM games WHERE player_x_id = ? OR player_o_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [req.userId, req.userId, parseInt(limit), parseInt(offset)],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(games.map(game => ({
      id: game.id,
      gameMode: game.game_mode,
      gridSize: game.grid_size,
      status: game.status,
      winner: game.winner,
      createdAt: game.created_at,
      endedAt: game.ended_at
    })));
  } catch (error) {
    next(error);
  }
});

// Forfeit game
router.post('/:gameId/forfeit', authMiddleware, async (req, res, next) => {
  try {
    const { gameId } = req.params;

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE games SET status = 'forfeited', ended_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [gameId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Game forfeited' });
  } catch (error) {
    next(error);
  }
});

// Get stats
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT total_wins, total_losses, total_draws, total_games FROM users WHERE id = ?`,
        [req.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const winRate = user.total_games > 0 
      ? ((user.total_wins / user.total_games) * 100).toFixed(1)
      : 0;

    res.json({
      wins: user.total_wins,
      losses: user.total_losses,
      draws: user.total_draws,
      totalGames: user.total_games,
      winRate: parseFloat(winRate)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
