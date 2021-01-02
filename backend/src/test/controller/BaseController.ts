import express, { Express } from 'express';
import { App } from '../../main/App';
import redis, { RedisClient } from 'redis';

/**
 * Creates an express app and registers all handlers and routes
 * * Used for integration tests that test controllers (supertest needs an instance of express app without the port binding)
 * */
export const registerTestApplication = async (
  redisClient: RedisClient
): Promise<Express> => {
  const app = new App();
  const expressApp = express();
  await app.registerHandlersAndRoutes(expressApp, redisClient);
  return expressApp;
};

export const connectRedisClient = async (): Promise<RedisClient> => {
  return redis.createClient({
    host: 'localhost',
    port: 6379,
  });
};
