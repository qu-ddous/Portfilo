require('dotenv').config();
const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const { initSocket } = require('./socket');

// ─── Routes ──────────────────────────────────────────────────
const authRoutes           = require('./routes/auth');
const dashboardRoutes      = require('./routes/user/dashboard');
const userWorkoutRoutes    = require('./routes/user/workouts');
const userMealRoutes       = require('./routes/user/meals');
const userWeightRoutes     = require('./routes/user/weight');
const userNotifRoutes      = require('./routes/user/notifications');
const adminDashRoutes      = require('./routes/admin/dashboard');
const adminWorkoutRoutes   = require('./routes/admin/workouts');
const adminMealRoutes      = require('./routes/admin/meals');
const adminUserRoutes      = require('./routes/admin/users');
const adminLogRoutes       = require('./routes/admin/logs');
const adminNotifRoutes     = require('./routes/admin/notifications');
const chatRoutes           = require('./routes/chat');
const userWaterRoutes      = require('./routes/user/water');
const userExerciseRoutes   = require('./routes/user/exercises');
const userAiCoachRoutes    = require('./routes/user/aiCoach');

// ─── App Setup ───────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ─── Socket.IO ───────────────────────────────────────────────
const io = initSocket(server);
app.set('io', io);

// ─── Middleware ───────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
}));
app.use(cors({
  origin: true, // Allow all origins for local testing
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🏋️ Fitness & Diet Tracker API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Mount Routes ────────────────────────────────────────────

// Auth
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/user',                  dashboardRoutes);
app.use('/api/user/workouts',         userWorkoutRoutes);
app.use('/api/user/meals',            userMealRoutes);
app.use('/api/user/weight',           userWeightRoutes);
app.use('/api/user/notifications',    userNotifRoutes);

// Admin Routes
app.use('/api/admin/dashboard',       adminDashRoutes);
app.use('/api/admin/workouts',        adminWorkoutRoutes);
app.use('/api/admin/meals',           adminMealRoutes);
app.use('/api/admin/users',           adminUserRoutes);
app.use('/api/admin/system/logs',     adminLogRoutes);
app.use('/api/admin/notifications',   adminNotifRoutes);
app.use('/api/user/water',            userWaterRoutes);
app.use('/api/user/exercises',        userExerciseRoutes);
app.use('/api/user/ai-coach',         userAiCoachRoutes);
app.use('/api/chat',                  chatRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(`🗄️  Supabase connected`);
  console.log(`\n📋 Routes:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/user/dashboard`);
  console.log(`   GET    /api/admin/dashboard`);
  console.log(`   ... 50+ endpoints ready\n`);
});

module.exports = { app, server };
