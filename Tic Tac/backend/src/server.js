require('dotenv').config();
const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');
const socketHandlers = require('./socket-handlers');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// Initialize socket handlers
socketHandlers(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
