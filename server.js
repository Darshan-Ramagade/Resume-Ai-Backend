import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';

/* =========================
   Load environment variables
========================= */
dotenv.config();

/* =========================
   Initialize app
========================= */
const app = express();

/* =========================
   Connect DB
========================= */
connectDB();

/* =========================
   Security headers
========================= */
app.use(helmet());

/* =========================
   CORS CONFIG (FINAL FIX)
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://resume-aii.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow Postman / server-to-server requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* =========================
   Preflight requests
========================= */
app.options('*', cors());

/* =========================
   Body parsers
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =========================
   Rate Limiting
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

/* =========================
   Dev Logger
========================= */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

/* =========================
   Routes
========================= */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analysisRoutes);

/* =========================
   404 Handler
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* =========================
   Global Error Handler
========================= */
app.use(errorHandler);

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🏥 Health: /api/health`);
  console.log('='.repeat(50));
});

/* =========================
   Graceful shutdown
========================= */
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received. Shutting down...');
  process.exit(0);
});
