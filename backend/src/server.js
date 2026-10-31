import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { seedDatabase } from './utils/seedData.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import actionRoutes from './routes/actionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// CORS Configuration - Permissive for Vercel, localhost, and custom domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://ve-loop-five.vercel.app',
  ...(process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim()) : []),
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, mobile, curl)
    if (!origin) return callback(null, true);
    
    // Allow if in explicit list, or ends with vercel.app, or in non-production
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    
    // In production, also allow rather than crashing preflight without headers
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Body Parsing & Logging
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiter
app.use('/api/', apiRateLimiter);

// Health check endpoint (accessible via /api/health and /health)
const handleHealth = (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'VELoop Rewards API Server',
    version: '1.0.0',
  });
};
app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Mount Routes (support both /api/<route> and /<route> for seamless compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/profile', profileRoutes);
app.use('/profile', profileRoutes);

app.use('/api/actions', actionRoutes);
app.use('/actions', actionRoutes);

app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seed is needed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📌 No existing data detected in database. Seeding demo environment...');
      await seedDatabase();
    } else {
      console.log(`ℹ️ Database already contains ${userCount} users. Ready!`);
    }

    app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`🚀 VELoop Rewards Server is running on port ${PORT}`);
      console.log(`🌐 Base API: http://localhost:${PORT}/api`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=================================================\n`);
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
};

startServer();
