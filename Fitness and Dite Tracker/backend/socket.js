const jwt = require('jsonwebtoken');

let ioInstance = null;

/**
 * Initialize Socket.IO on an HTTP server
 * @param {http.Server} server
 * @returns {SocketIO.Server}
 */
const initSocket = (server) => {
  const { Server } = require('socket.io');

  ioInstance = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:3000',
        '*',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // ─── JWT Auth Middleware ──────────────────────────────────────
  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.user = decoded;
      socket.userId = decoded.sub;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  // ─── Connection Handler ───────────────────────────────────────
  ioInstance.on('connection', (socket) => {
    console.log(`🔌 Connected: ${socket.userId} (${socket.userRole})`);

    // Join personal room
    socket.join(`user:${socket.userId}`);

    // Admins join admin room
    if (socket.userRole === 'admin') {
      socket.join('admin-room');
      console.log(`👑 Admin ${socket.userId} joined admin-room`);
    }

    // Client ping
    socket.on('ping', () => socket.emit('pong', { timestamp: new Date() }));

    socket.on('disconnect', (reason) => {
      console.log(`❌ Disconnected: ${socket.userId} — ${reason}`);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);
    });
  });

  return ioInstance;
};

/**
 * Get the Socket.IO instance (after init)
 */
const getIO = () => {
  if (!ioInstance) throw new Error('Socket.IO not initialized');
  return ioInstance;
};

module.exports = { initSocket, getIO };
