import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRouter from './routes/index';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration for frontend clients
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev mode, can restrict in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root landing endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'PropWise Backend API',
    description: 'Cloud intelligence & authentication service for PropWise Real Estate Platform',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      userProfile: '/api/users/me (requires Authorization: Bearer <token>)',
      updateProfile: 'PUT /api/users/profile (requires Authorization: Bearer <token>)'
    },
    documentation: 'See backend/README.md for setup and deployment instructions'
  });
});

// Mount API routes
app.use('/api', apiRouter);

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

import { externalListingService } from './services/externalListingService';

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 [PropWise Backend] Server running on http://localhost:${env.PORT}`);
  console.log(`📡 Healthcheck available at: http://localhost:${env.PORT}/api/health`);
  console.log(`🔐 Supabase configured: ${env.isSupabaseConfigured ? '✅ YES' : '⚠️ NO (Configure in backend/.env)'}\n`);

  // Initialize external real-estate listings scheduler
  externalListingService.initScheduler();
});

export default app;
