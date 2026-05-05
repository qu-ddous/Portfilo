const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Generate room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create room
router.post('/create', authMiddleware, async (req, res, next) => {
  try {
    const { roomName, gridSize } = req.body;
    const roomId = uuidv4();
    const code = generateRoomCode();

    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO rooms (id, code, host_id, room_name, grid_size) VALUES (?, ?, ?, ?, ?)`,
        [roomId, code, req.userId, roomName, gridSize || 3],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Add host as player
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO room_players (id, room_id, player_id) VALUES (?, ?, ?)`,
        [uuidv4(), roomId, req.userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(201).json({
      id: roomId,
      code,
      hostId: req.userId,
      roomName,
      gridSize: gridSize || 3,
      maxPlayers: 2,
      status: 'waiting'
    });
  } catch (error) {
    next(error);
  }
});

// Join room
router.post('/:roomCode/join', authMiddleware, async (req, res, next) => {
  try {
    const { roomCode } = req.params;

    const room = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM rooms WHERE code = ?`, [roomCode], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Room is not available' });
    }

    // Check if already in room
    const existingPlayer = await new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM room_players WHERE room_id = ? AND player_id = ?`,
        [room.id, req.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!existingPlayer) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO room_players (id, room_id, player_id) VALUES (?, ?, ?)`,
          [uuidv4(), room.id, req.userId],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    res.json({
      id: room.id,
      code: room.code,
      roomName: room.room_name,
      gridSize: room.grid_size,
      status: room.status
    });
  } catch (error) {
    next(error);
  }
});

// Get available rooms
router.get('/available', async (req, res, next) => {
  try {
    const { gridSize, limit = 20 } = req.query;

    let query = `SELECT * FROM rooms WHERE status = 'waiting'`;
    const params = [];

    if (gridSize) {
      query += ` AND grid_size = ?`;
      params.push(parseInt(gridSize));
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(parseInt(limit));

    const rooms = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(rooms.map(room => ({
      id: room.id,
      code: room.code,
      roomName: room.room_name,
      gridSize: room.grid_size,
      status: room.status,
      createdAt: room.created_at
    })));
  } catch (error) {
    next(error);
  }
});

// Get room
router.get('/:roomCode', async (req, res, next) => {
  try {
    const { roomCode } = req.params;

    const room = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM rooms WHERE code = ?`, [roomCode], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({
      id: room.id,
      code: room.code,
      hostId: room.host_id,
      roomName: room.room_name,
      gridSize: room.grid_size,
      status: room.status
    });
  } catch (error) {
    next(error);
  }
});

// Leave room
router.post('/:roomCode/leave', authMiddleware, async (req, res, next) => {
  try {
    const { roomCode } = req.params;

    const room = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM rooms WHERE code = ?`, [roomCode], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM room_players WHERE room_id = ? AND player_id = ?`,
        [room.id, req.userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
