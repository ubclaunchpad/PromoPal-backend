import express, { Express } from 'express';
import { App } from '../../main/App';
import redisMock, { RedisClient } from 'redis-mock';
import { auth } from 'firebase-admin/lib/auth';
import Auth = auth.Auth;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseMock = require('firebase-mock');

/**
 * Creates an express app and registers all handlers and routes
 * * Used for integration tests that test controllers (supertest needs an instance of express app without the port binding)
 * */
export const registerTestApplication = async (
  redisClient: RedisClient,
  firebaseAdmin: Auth
): Promise<Express> => {
  const app = new App();
  const expressApp = express();
  await app.registerHandlersAndRoutes(expressApp, redisClient, firebaseAdmin);
  return expressApp;
};

export const connectRedisClient = async (): Promise<RedisClient> => {
  // see https://www.npmjs.com/package/redis-mock
  return redisMock.createClient();
};

export const createFirebaseMock = (): Auth => {
  const mockAuth = new firebaseMock.MockAuthentication();
  const mockDatabase = new firebaseMock.MockFirebase();
  const mockFirestore = new firebaseMock.MockFirestore();
  const mockStorage = new firebaseMock.MockStorage();
  const mockMessaging = new firebaseMock.MockMessaging();
  const mockSdk = new firebaseMock.MockFirebaseSdk(
    // use null if your code does not use RTDB
    (path: any) => {
      return path ? mockDatabase.child(path) : mockDatabase;
    },
    // use null if your code does not use AUTHENTICATION
    () => {
      return mockAuth;
    },
    // use null if your code does not use FIRESTORE
    // () => {
    //   return mockFirestore;
    // },
    null,
    // use null if your code does not use STORAGE
    () => {
      return mockStorage;
    },
    // use null if your code does not use MESSAGING
    // () => {
    //   return mockMessaging;
    // }
    null
  );
  return mockSdk.auth();
};
