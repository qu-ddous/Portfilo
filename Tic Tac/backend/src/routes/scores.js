const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Get leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, gridSize } = req.query;

    let query = `
      SELECT id, name, total_wins, total_games, 
             CASE WHEN total_games > 0 THEN (total_wins * 100.0 / total_games) ELSE 0 END as win_rate,
             last_login
      FROM users 
      WHERE status = 'active'
      ORDER BY total_wins DESC, win_rate DESC
      LIMIT ? OFFSET ?
    `;

    const players = await new Promise((resolve, reject) => {
      db.all(query, [parseInt(limit), parseInt(offset)], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(players.map((player, index) => ({
      rank: parseInt(offset) + index + 1,
      playerId: player.id,
      playerName: player.name,
      totalWins: player.total_wins,
      totalGames: player.total_games,
      winRate: parseFloat(player.win_rate.toFixed(1)),
      lastPlayed: player.last_login
    })));
  } catch (error) {
    next(error);
  }
});

// Save score
router.post('/save', authMiddleware, async (req, res, next) => {
  try {
    const { gameId, opponent, result, gridSize } = req.body;
    const scoreId = uuidv4();

    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO scores (id, player_id, game_id, opponent_name, result, grid_size) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [scoreId, req.userId, gameId, opponent, result, gridSize],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Update user stats
    const updateField = result === 'win' ? 'total_wins' : (result === 'loss' ? 'total_losses' : 'total_draws');
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET ${updateField} = ${updateField} + 1, total_games = total_games + 1 WHERE id = ?`,
        [req.userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(201).json({
      id: scoreId,
      playerId: req.userId,
      gameId,
      opponent,
      result,
      gridSize
    });
  } catch (error) {
    next(error);
  }
});

// Get my scores
router.get('/my-scores', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const scores = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM scores WHERE player_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [req.userId, parseInt(limit), parseInt(offset)],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(scores);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
