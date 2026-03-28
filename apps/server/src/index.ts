import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import Redis from 'ioredis';
import { config } from './config';
import { connectDB } from './config/database';
import { setupSocketIO } from './sockets';

// Route imports
import authRoutes from './routes/auth';
import clubRoutes from './routes/clubs';
import playerRoutes from './routes/players';
import tacticRoutes from './routes/tactics';

async function main() {
  // ---- Express setup ----
  const app = express();
  const httpServer = createServer(app);

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  // ---- Health check ----
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ---- Routes ----
  app.use('/api/auth', authRoutes);
  app.use('/api/clubs', clubRoutes);
  app.use('/api/players', playerRoutes);
  app.use('/api/tactics', tacticRoutes);

  // ---- Redis connection check ----
  const redis = new Redis(config.redisUrl);
  redis.on('connect', () => console.log('✅ Redis connected successfully'));
  redis.on('error', (err) => console.error('❌ Redis connection error:', err.message));

  // ---- Socket.IO ----
  setupSocketIO(httpServer);

  // ---- Database ----
  await connectDB();

  // ---- Start server ----
  httpServer.listen(config.port, '0.0.0.0', () => {
    console.log(`\n🚀 Footlaw Server running on port ${config.port}`);
    console.log(`   Health: http://localhost:${config.port}/api/health`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

main().catch((error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});
