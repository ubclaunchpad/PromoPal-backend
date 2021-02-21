import express, { Express } from 'express';
import { App } from '../../main/App';
import redisMock, { RedisClient } from 'redis-mock';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebasemock = require('firebase-mock');

/**
 * Creates an express app and registers all handlers and routes
 * * Used for integration tests that test controllers (supertest needs an instance of express app without the port binding)
 * */
export const registerTestApplication = async (
  redisClient: RedisClient,
  firebaseadmin: any
): Promise<Express> => {
  const app = new App();
  const expressApp = express();
  await app.registerHandlersAndRoutes(expressApp, redisClient, firebaseadmin);
  return expressApp;
};

export const connectRedisClient = async (): Promise<RedisClient> => {
  // see https://www.npmjs.com/package/redis-mock
  return redisMock.createClient();
};

export const createFirebaseMock = () => {
  const mockauth = new firebasemock.MockAuthentication();
  const mockdatabase = new firebasemock.MockFirebase();
  const mockfirestore = new firebasemock.MockFirestore();
  const mockstorage = new firebasemock.MockStorage();
  const mockmessaging = new firebasemock.MockMessaging();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    // use null if your code does not use RTDB
    (path: any) => {
      return path ? mockdatabase.child(path) : mockdatabase;
    },
    // use null if your code does not use AUTHENTICATION
    () => {
      return mockauth;
    },
    // use null if your code does not use FIRESTORE
    () => {
      return mockfirestore;
    },
    // use null if your code does not use STORAGE
    () => {
      return mockstorage;
    },
    // use null if your code does not use MESSAGING
    () => {
      return mockmessaging;
    }
  );
  return mocksdk;
};
