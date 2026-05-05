const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Get all achievements
router.get('/', async (req, res, next) => {
  try {
    const achievements = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM achievements ORDER BY created_at`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(achievements);
  } catch (error) {
    next(error);
  }
});

// Get my achievements
router.get('/my-achievements', authMiddleware, async (req, res, next) => {
  try {
    const achievements = await new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, ua.unlocked_at 
         FROM achievements a
         LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
         ORDER BY a.created_at`,
        [req.userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.json(achievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      isUnlocked: !!achievement.unlocked_at,
      unlockedAt: achievement.unlocked_at
    })));
  } catch (error) {
    next(error);
  }
});

// Check achievements
router.post('/check', authMiddleware, async (req, res, next) => {
  try {
    const { gameId } = req.body;

    // Get user stats
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE id = ?`,
        [req.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const newlyUnlocked = [];

    // Check achievements logic
    const achievementChecks = [
      { name: 'First Victory', condition: user.total_wins >= 1 },
      { name: 'Veteran', condition: user.total_wins >= 10 },
      { name: 'Champion', condition: user.total_wins >= 50 },
      { name: 'Legend', condition: user.total_wins >= 100 }
    ];

    for (const check of achievementChecks) {
      if (check.condition) {
        const achievement = await new Promise((resolve, reject) => {
          db.get(
            `SELECT * FROM achievements WHERE name = ?`,
            [check.name],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            }
          );
        });

        if (achievement) {
          const existing = await new Promise((resolve, reject) => {
            db.get(
              `SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?`,
              [req.userId, achievement.id],
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              }
            );
          });

          if (!existing) {
            await new Promise((resolve, reject) => {
              db.run(
                `INSERT INTO user_achievements (id, user_id, achievement_id) VALUES (?, ?, ?)`,
                [uuidv4(), req.userId, achievement.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });

            newlyUnlocked.push(achievement);
          }
        }
      }
    }

    res.json(newlyUnlocked);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
