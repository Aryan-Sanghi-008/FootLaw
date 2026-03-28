import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/footlaw',
  jwtSecret: process.env.JWT_SECRET || 'footlaw_dev_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'footlaw_dev_refresh_secret',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  corsOrigin: process.env.CORS_ORIGIN || '*',
} as const;
