const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/database');
const GameService = require('./services/gameService');
const { PLAYER_X, PLAYER_O, STATUS_PLAYING, STATUS_WON, STATUS_DRAW } = require('./config/constants');

module.exports = (io) => {
  // Authentication middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Create room
    socket.on('game:create-room', async (data) => {
      try {
        const { roomName, gridSize } = data;
        const roomId = uuidv4();
        const code = generateRoomCode();

        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO rooms (id, code, host_id, room_name, grid_size) VALUES (?, ?, ?, ?, ?)`,
            [roomId, code, socket.userId, roomName, gridSize || 3],
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
            [uuidv4(), roomId, socket.userId],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        socket.join(code);

        socket.emit('game:room-created', {
          room: {
            id: roomId,
            code,
            hostId: socket.userId,
            roomName,
            gridSize: gridSize || 3,
            status: 'waiting'
          }
        });
      } catch (error) {
        socket.emit('game:error', { message: error.message });
      }
    });

    // Join room
    socket.on('game:join-room', async (data) => {
      try {
        const { roomCode } = data;

        const room = await new Promise((resolve, reject) => {
          db.get(`SELECT * FROM rooms WHERE code = ?`, [roomCode], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!room) {
          return socket.emit('game:error', { message: 'Room not found' });
        }

        if (room.status !== 'waiting') {
          return socket.emit('game:error', { message: 'Room is not available' });
        }

        // Add player to room
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO room_players (id, room_id, player_id) VALUES (?, ?, ?)`,
            [uuidv4(), room.id, socket.userId],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        socket.join(roomCode);

        // Notify all players in room
        io.to(roomCode).emit('game:player-joined', {
          room: {
            id: room.id,
            code: room.code,
            roomName: room.room_name,
            gridSize: room.grid_size
          },
          playerId: socket.userId
        });

        // Auto-start if 2 players
        const playerCount = await new Promise((resolve, reject) => {
          db.get(
            `SELECT COUNT(*) as count FROM room_players WHERE room_id = ?`,
            [room.id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row.count);
            }
          );
        });

        if (playerCount >= 2) {
          // Create game
          const gameId = uuidv4();
          const board = GameService.createEmptyBoard(room.grid_size);

          await new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO games (id, game_mode, grid_size, status, board, current_player) 
               VALUES (?, 'online', ?, ?, ?, ?)`,
              [gameId, room.grid_size, STATUS_PLAYING, JSON.stringify(board), PLAYER_X],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          // Update room status
          await new Promise((resolve, reject) => {
            db.run(
              `UPDATE rooms SET status = 'playing' WHERE id = ?`,
              [room.id],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          io.to(roomCode).emit('game:game-started', {
            gameId,
            board,
            currentPlayer: PLAYER_X
          });
        }
      } catch (error) {
        socket.emit('game:error', { message: error.message });
      }
    });

    // Make move
    socket.on('game:move', async (data) => {
      try {
        const { roomCode, gameId, row, col, player } = data;

        // Get game
        const game = await new Promise((resolve, reject) => {
          db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (!game) {
          return socket.emit('game:error', { message: 'Game not found' });
        }

        const board = JSON.parse(game.board);

        // Validate move
        if (!GameService.isValidMove(board, row, col)) {
          return socket.emit('game:error', { message: 'Invalid move' });
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
            `UPDATE games SET board = ?, current_player = ?, winner = ?, winning_line = ?, status = ? WHERE id = ?`,
            [JSON.stringify(board), nextPlayer, winner, JSON.stringify(winningLine), newStatus, gameId],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        // Broadcast to room
        io.to(roomCode).emit('game:move-received', {
          game: {
            id: gameId,
            board,
            currentPlayer: nextPlayer,
            winner,
            winningLine,
            status: newStatus
          },
          move: { row, col, player }
        });

        // If game ended
        if (newStatus !== STATUS_PLAYING) {
          io.to(roomCode).emit('game:game-ended', {
            game: {
              id: gameId,
              winner,
              status: newStatus
            }
          });
        }
      } catch (error) {
        socket.emit('game:error', { message: error.message });
      }
    });

    // Leave room
    socket.on('game:leave', async (data) => {
      try {
        const { roomCode } = data;

        const room = await new Promise((resolve, reject) => {
          db.get(`SELECT * FROM rooms WHERE code = ?`, [roomCode], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });

        if (room) {
          await new Promise((resolve, reject) => {
            db.run(
              `DELETE FROM room_players WHERE room_id = ? AND player_id = ?`,
              [room.id, socket.userId],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });

          socket.leave(roomCode);

          io.to(roomCode).emit('game:player-left', {
            playerId: socket.userId
          });
        }
      } catch (error) {
        socket.emit('game:error', { message: error.message });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
