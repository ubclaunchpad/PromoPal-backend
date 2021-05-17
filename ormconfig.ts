export default {
  type: 'postgres',
  // DATABASE_URL comes from heroku
  url:
    process.env.DATABASE_URL ??
    `postgres://postgres:postgres@${
      process.env['DB_HOST'] ?? 'localhost'
    }:5432/foodies`,
  synchronize: true,
  dropSchema: false,
  logging: false,
  cache: true,
  entities: ['src/main/entity/**/*.ts'],
  migrations: ['src/main/migration/**/*.ts'],
  migrationsRun: true,
  subscribers: ['src/main/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/main/entity',
    migrationsDir: 'src/main/migration',
    subscribersDir: 'src/main/subscriber',
  },
  // https://github.com/typeorm/typeorm/issues/278
  extra: {
    ssl: !!process.env.DATABASE_SSL,
  },
};
