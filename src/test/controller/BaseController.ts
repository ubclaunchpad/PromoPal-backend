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
import { User } from '../../main/entity/User';
import { getConnection } from 'typeorm';
import { UserRepository } from '../../main/repository/UserRepository';
import { UserFactory } from '../factory/UserFactory';
import { randomString } from '../utility/Utility';
import { GeocoderConfig } from '../../main/service/GeocodingService';

export class BaseController {
  mockRedisClient: RedisClient;
  mockFirebaseAdmin: Auth;
  mockGeocoderConfig: GeocoderConfig;
  mockS3: S3;
  axiosInstance: AxiosInstance;
  idToken: string;
  authenticatedUser: User;

  constructor() {
    this.mockRedisClient = BaseController.createRedisMock();
    this.mockFirebaseAdmin = BaseController.createFirebaseMock();
    this.mockGeocoderConfig = BaseController.createMockNodeGeocoderConfig();
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
      this.mockGeocoderConfig,
      this.mockS3,
      this.axiosInstance
    );
    // cleanup resources from previous bucket if possible
    await this.mockS3.deleteBucket({ Bucket: S3_BUCKET }).promise();
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
    const firebaseAdmin = mockSdk.auth();
    (firebaseAdmin as any).autoFlush();
    return firebaseAdmin;
  };

  static createMockNodeGeocoderConfig = (): GeocoderConfig => {
    const geocoder = nodeGeocoder({
      provider: 'openstreetmap',
    });
    return {
      geocoder: geocoder,
    };
  };

  static createS3Mock = (): S3 => {
    return new AWSMock.S3();
  };

  /**
   * Create a mock authenticated user.
   * * Note this should be called in the beforeEach of test files (we do not want tests to rely on the same user in multiple tests)
   * */
  async createAuthenticatedUser(): Promise<void> {
    const authenticatedUser = new UserFactory().generate();
    await getConnection()
      .getCustomRepository(UserRepository)
      .save(authenticatedUser);
    // create user
    const user = await (this.mockFirebaseAdmin as any).createUser({
      uid: authenticatedUser.id,
      email: randomString(20) + '@gmail.com',
      password: randomString(20),
    });
    this.idToken = await user.getIdToken();
    this.authenticatedUser = authenticatedUser;
  }

  /**
   * Delete the mock authenticated user
   * * Note this should be called in the afterEach of test files (we do not want tests to rely on the same user in multiple tests)
   * */
  async deleteAuthenticatedUser(): Promise<void> {
    await this.mockFirebaseAdmin.deleteUser(this.authenticatedUser.id);
  }

  quit = async (): Promise<void> => {
    this.mockRedisClient.quit();
    await this.mockS3.deleteBucket({ Bucket: S3_BUCKET }).promise();
  };
}
