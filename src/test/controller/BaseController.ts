import express, { Express } from 'express';
import { App } from '../../main/App';
import redisMock, { RedisClient } from 'redis-mock';
import { auth } from 'firebase-admin/lib/auth';
import Auth = auth.Auth;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseMock = require('firebase-mock');
import axios, { AxiosInstance } from 'axios';
import nodeGeocoder, { Geocoder } from 'node-geocoder';
import AWSMock from 'mock-aws-s3';
import { S3 } from 'aws-sdk';
import { S3_BUCKET } from '../../main/service/ResourceCleanupService';

export class BaseController {
  mockRedisClient: RedisClient;
  mockFirebaseAdmin: Auth;
  mockGeoCoder: Geocoder;
  mockS3: S3;
  axiosInstance: AxiosInstance;
  idToken: string;
  firebaseId: string;

  constructor() {
    this.mockRedisClient = BaseController.createRedisMock();
    this.mockFirebaseAdmin = BaseController.createFirebaseMock();
    this.mockGeoCoder = BaseController.createMockNodeGeocoder();
    this.mockS3 = BaseController.createS3Mock();
    this.axiosInstance = axios.create();
  }

  /**
   * Creates an express app and registers all handlers and routes
   * * Used for integration tests that test controllers (supertest needs an instance of express app without the port binding)
   * */
  registerTestApplication = async (): Promise<Express> => {
    const app = new App();
    const expressApp = express();
    await app.registerHandlersAndRoutes(
      expressApp,
      this.mockRedisClient,
      this.mockFirebaseAdmin,
      this.mockGeoCoder,
      this.mockS3,
      this.axiosInstance
    );
    // cleanup resources from previous bucket if possible
    await this.mockS3.deleteBucket({ Bucket: S3_BUCKET }).promise();
    await (this.mockFirebaseAdmin as any).autoFlush();
    await this.createAuthenticatedUser();
    return expressApp;
  };

  static createRedisMock = (): RedisClient => {
    // see https://www.npmjs.com/package/redis-mock
    return redisMock.createClient();
  };

  static createFirebaseMock = (): Auth => {
    const mockAuth = new firebaseMock.MockAuthentication();
    const mockDatabase = new firebaseMock.MockFirebase();
    // const mockFirestore = new firebaseMock.MockFirestore();
    const mockStorage = new firebaseMock.MockStorage();
    // const mockMessaging = new firebaseMock.MockMessaging();
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

  static createMockNodeGeocoder = (): Geocoder => {
    return nodeGeocoder({
      provider: 'openstreetmap',
    });
  };

  static createS3Mock = (): S3 => {
    return new AWSMock.S3();
  };

  /**
   * Create a mock authenticated user
   * */
  async createAuthenticatedUser(): Promise<void> {
    // create user
    const user = await (this.mockFirebaseAdmin as any).createUser({
      email: 'test@gmail.com',
      password: 'testpassword',
    });
    this.idToken = await user.getIdToken();
    this.firebaseId = user.uid;
  }

  quit = async (): Promise<void> => {
    this.mockRedisClient.quit();
    await this.mockS3.deleteBucket({ Bucket: S3_BUCKET }).promise();
  };
}
