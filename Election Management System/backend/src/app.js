// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes.js';
import electionRoutes from './routes/election.routes.js';
import voteRoutes from './routes/vote.routes.js';
import adminRoutes from './routes/admin.routes.js';
import voterRegistrationRoutes from './routes/voter-registration.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const app = express();

// ═══════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('dev'));

// Global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(globalLimiter);

// Stricter rate limit for voting
const voteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 votes per minute max
  message: 'Too many vote attempts. Please wait before voting again.'
});

// ═══════════════════════════════════════
// BODY PARSING
// ═══════════════════════════════════════
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ═══════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: '🗳️ Election Management System Backend is running'
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Election routes
app.use('/api/elections', electionRoutes);

// Vote routes (with rate limiting)
app.use('/api/votes', voteLimiter, voteRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Voter registration routes (nested under elections)
app.use('/api/elections/:electionId/register', voterRegistrationRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// ═══════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ═══════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message, code: err.code });
});

// ═══════════════════════════════════════
// SERVER START
// ═══════════════════════════════════════
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🗳️  Election Management System      ║
║  Backend Server Running               ║
╠════════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${NODE_ENV}
║  Time: ${new Date().toISOString()}
║  Endpoints:
║    GET  /api/health
║    POST /api/auth/register
║    POST /api/auth/login
║    GET  /api/elections
║    POST /api/votes/cast
║    POST /api/admin/creator-requests/:id/approve
║  Database: Supabase (PostgreSQL)
║  Auth: JWT + Supabase
║  Security: Helmet, CORS, Rate Limiting
╚════════════════════════════════════════╝
  `);
});

export default app;
