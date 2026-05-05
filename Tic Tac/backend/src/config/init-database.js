const db = require('./database');

const createTables = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      status TEXT DEFAULT 'active',
      total_wins INTEGER DEFAULT 0,
      total_losses INTEGER DEFAULT 0,
      total_draws INTEGER DEFAULT 0,
      total_games INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Games table
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      game_mode TEXT NOT NULL,
      grid_size INTEGER NOT NULL,
      status TEXT NOT NULL,
      player_x_id TEXT,
      player_o_id TEXT,
      board TEXT NOT NULL,
      current_player TEXT,
      winner TEXT,
      winning_line TEXT,
      ai_difficulty TEXT,
      duration_seconds INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (player_x_id) REFERENCES users(id),
      FOREIGN KEY (player_o_id) REFERENCES users(id)
    )
  `);

  // Scores table
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      game_id TEXT NOT NULL,
      opponent_name TEXT NOT NULL,
      result TEXT NOT NULL,
      grid_size INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player_id) REFERENCES users(id),
      FOREIGN KEY (game_id) REFERENCES games(id)
    )
  `);

  // Achievements table
  db.run(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User achievements table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (achievement_id) REFERENCES achievements(id),
      UNIQUE(user_id, achievement_id)
    )
  `);

  // Rooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      host_id TEXT NOT NULL,
      room_name TEXT NOT NULL,
      grid_size INTEGER DEFAULT 3,
      max_players INTEGER DEFAULT 2,
      status TEXT DEFAULT 'waiting',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (host_id) REFERENCES users(id)
    )
  `);

  // Room players table
  db.run(`
    CREATE TABLE IF NOT EXISTS room_players (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (player_id) REFERENCES users(id),
      UNIQUE(room_id, player_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tables:', err);
    } else {
      console.log('All tables created successfully');
      insertDefaultAchievements();
    }
  });
};

const insertDefaultAchievements = () => {
  const { v4: uuidv4 } = require('uuid');
  
  const achievements = [
    { id: uuidv4(), name: 'First Victory', description: 'Win your first game', icon: '🏆' },
    { id: uuidv4(), name: 'Hat Trick', description: 'Win 3 games in a row', icon: '🔥' },
    { id: uuidv4(), name: 'Unstoppable', description: 'Win 5 games in a row', icon: '⚡' },
    { id: uuidv4(), name: 'AI Master', description: 'Beat the Hard AI', icon: '🤖' },
    { id: uuidv4(), name: 'Veteran', description: 'Win 10 games total', icon: '🎖️' },
    { id: uuidv4(), name: 'Champion', description: 'Win 50 games total', icon: '👑' },
    { id: uuidv4(), name: 'Legend', description: 'Win 100 games total', icon: '🌟' },
    { id: uuidv4(), name: 'Flawless', description: 'Win without opponent scoring', icon: '💎' }
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO achievements (id, name, description, icon) VALUES (?, ?, ?, ?)');
  
  achievements.forEach(achievement => {
    stmt.run(achievement.id, achievement.name, achievement.description, achievement.icon);
  });
  
  stmt.finalize(() => {
    console.log('Default achievements inserted');
    db.close();
  });
};

createTables();
