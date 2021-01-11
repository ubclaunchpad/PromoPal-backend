import express, { Express } from 'express';
import { App } from '../../main/App';
import redisMock, { RedisClient } from 'redis-mock';

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
  // see https://www.npmjs.com/package/redis-mock
  return redisMock.createClient();
};
