import express, { Express } from 'express';
import { App } from '../../main/App';

/**
 * Creates an express app and registers all handlers and routes
 * * Used for integration tests that test controllers (supertest needs an instance of express app without the port binding)
 * */
export const registerTestApplication = (): Express => {
  const app = new App();
  const expressApp = express();
  app.registerHandlersAndRoutes(expressApp);
  return expressApp;
};
