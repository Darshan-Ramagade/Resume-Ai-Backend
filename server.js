import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';

dotenv.config();

const app = express();

/* ================= DATABASE ================= */
connectDB();

/* ================= SECURITY ================= */
app.use(helmet());

/* ================= CORS ================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://resume-aii.netlify.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / server-to-server

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ IMPORTANT

/* ================= BODY PARSERS ================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ================= RATE LIMIT ================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

/* ================= DEV LOG ================= */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

/* ================= ROUTES ================= */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running 🚀',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analysisRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(40));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log('='.repeat(40));
});

/* ================= GRACEFUL SHUTDOWN ================= */
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  process.exit(0);
});
