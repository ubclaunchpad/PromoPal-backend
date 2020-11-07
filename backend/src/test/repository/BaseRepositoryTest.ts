import { Connection, createConnection } from 'typeorm';

// use this class whenever we want to write unit/integration tests that interact with foodies_test database.
export class BaseRepositoryTest {
  static establishTestConnection(): Promise<Connection> {
    return createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'foodies_test',
      synchronize: true,
      dropSchema: true,
      logging: false,
      entities: ['src/main/entity/**/*.ts'],
      migrations: ['src/main/migration/**/*.ts'],
      subscribers: ['src/main/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/main/entity',
        migrationsDir: 'src/main/migration',
        subscribersDir: 'src/main/subscriber',
      },
    });
  }
}
