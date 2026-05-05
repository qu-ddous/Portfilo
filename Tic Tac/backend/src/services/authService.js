const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

class AuthService {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  static async createUser(name, email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = uuidv4();
        const passwordHash = await this.hashPassword(password);

        db.run(
          `INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)`,
          [id, name, email, passwordHash],
          function(err) {
            if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                reject(new Error('Email already exists'));
              } else {
                reject(err);
              }
            } else {
              resolve({ id, name, email });
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  static async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static async findUserById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, avatar_url, status, total_wins, total_losses, total_draws, total_games, created_at, last_login FROM users WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  static async updateLastLogin(userId) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

module.exports = AuthService;
