const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const user = await AuthService.createUser(name, email, password);
      const token = AuthService.generateToken(user.id);

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          totalWins: 0,
          totalLosses: 0,
          totalDraws: 0,
          totalGames: 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await AuthService.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await AuthService.comparePassword(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      await AuthService.updateLastLogin(user.id);

      const token = AuthService.generateToken(user.id);

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          totalWins: user.total_wins,
          totalLosses: user.total_losses,
          totalDraws: user.total_draws,
          totalGames: user.total_games
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.findUserById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const winRate = user.total_games > 0 
        ? ((user.total_wins / user.total_games) * 100).toFixed(1)
        : 0;

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
        totalWins: user.total_wins,
        totalLosses: user.total_losses,
        totalDraws: user.total_draws,
        totalGames: user.total_games,
        winRate: parseFloat(winRate),
        createdAt: user.created_at,
        lastLogin: user.last_login
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, avatar } = req.body;
      const db = require('../config/database');

      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE users SET name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [name, avatar, req.userId],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      const user = await AuthService.findUserById(req.userId);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res) {
    res.json({ message: 'Logged out successfully' });
  }
}

module.exports = AuthController;
