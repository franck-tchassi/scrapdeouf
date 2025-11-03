//lib/redis.ts

import { Redis } from 'ioredis';

// Ensure Redis URL is provided in environment variables
const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined. Redis functionality is required for the queue.");
}

// Initialize Redis client
export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected successfully.');
});