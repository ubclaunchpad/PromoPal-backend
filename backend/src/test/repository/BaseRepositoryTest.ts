import { createConnection, EntityMetadata, getConnection } from 'typeorm';

// use this class whenever we want to write unit/integration tests that interact with foodies_test database.
const connection = {
  async create(): Promise<void> {
    await createConnection({
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
      migrationsRun: true,
      subscribers: ['src/main/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/main/entity',
        migrationsDir: 'src/main/migration',
        subscribersDir: 'src/main/subscriber',
      },
    });
  },

  async close(): Promise<void> {
    await this.clear();
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const promises = entities.map(async (entity: EntityMetadata) => {
      const repository = connection.getRepository(entity.name);
      return repository.query(`DELETE FROM ${entity.tableName}`);
    });
    await Promise.all(promises);
  },
};

export default connection;
