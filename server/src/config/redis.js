const Redis = require('ioredis');
const config = require('../config');
const logger = require('../utils/logger');

let redis;

try {
  redis = new Redis(config.redis.url, {
    retryStrategy: (times) => Math.min(times * 50, 2000),
    lazyConnect: true,
  });

  redis.on('connect', () => logger.info('Redis connected'));
  redis.on('error', (err) => logger.error('Redis error', { error: err.message }));
} catch (err) {
  logger.warn('Redis unavailable – caching disabled', { error: err.message });
  redis = null;
}

/**
 * Safe get – returns null if Redis is down
 */
const cacheGet = async (key) => {
  if (!redis) return null;
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

/**
 * Safe set with TTL in seconds
 */
const cacheSet = async (key, value, ttlSeconds = 300) => {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // silently skip
  }
};

/**
 * Delete key(s) by exact match or pattern prefix
 */
const cacheDel = async (...keys) => {
  if (!redis) return;
  try {
    await redis.del(...keys);
  } catch {
    // silently skip
  }
};

module.exports = { redis, cacheGet, cacheSet, cacheDel };
