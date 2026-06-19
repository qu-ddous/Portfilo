const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Routes
const inventoryRoutes = require('./routes/inventory');
const donorRoutes     = require('./routes/donors');
const patientRoutes   = require('./routes/patients');
const requestRoutes   = require('./routes/requests');
const userRoutes     = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const authRoutes     = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const reportRoutes    = require('./routes/reports');
const settingRoutes   = require('./routes/settings');

app.use('/api/auth',      authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/donors',    donorRoutes);
app.use('/api/patients',  patientRoutes);
app.use('/api/requests',   requestRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);

app.get('/', (req, res) => {
  res.send('BloodLink API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
