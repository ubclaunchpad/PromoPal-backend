# Foodies Backend Project

## Requirements

1. Postgres
   - when installing, use the default password "postgres"
2. TypeORM Global Installation (`yarn add typeorm -g`)
   - this will install the TypeORM CLI as well

## Before starting

1. Run `yarn install` to install all dependencies

## Configure environment variables

```
Make a copy of `sample.env` and rename it to `.env`.
Fill out the environment variables respectively
```

## Setting up databases

You will need two databases, `foodies` and `foodies_test`.

**Make sure your username is `postgres`**.

1. Launch `psql`
2. Connect to localhost and select everything to default. The password should be the same as the one during installation, "postgres".
3. Once logged in, execute the following commands. **Important:** don't forget the semicolons.

```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

ALTER USER postgres CREATEDB;

// repeat these two lines for both databases
CREATE DATABASE foodies;

GRANT ALL PRIVILEGES ON DATABASE foodies TO postgres;
```

## Unit/Integration tests

Currently, all tests drop the schema after each test. Therefore, do not design tests to be reliant on data from previous tests.

## Drop the database schema:

```
yarn run dropSchema
```

## Sync the database schema

This will setup the schema, without any data.

```
yarn run syncSchema
```

## Run migrations

This will run any migrations in the `/migrations` folder. Currently `ormconfig.json` is configured to run migrations when the application starts.

```
yarn run run_migration
```

## Running unit tests

If you want to run all tests in IntelliJ, add this new configuration. It's very important you specify
the working directory as specified because TypeORM config needs the correct directory to find all the entities, migrations, subcribers etc.
![image](https://user-images.githubusercontent.com/49849754/99886688-66ff8080-2bf3-11eb-88b1-2cb9879988db.png)

You can also run tests using this command

```
yarn run test
```

## Local development (without docker)

### Change ormconfig.json

Find `ormconfig.json` and change the following line to `host: localhost`

### Using Intellij

Make sure you created the databases first.
IntelliJ can show you your databases and tables. Go to the `Database` tab and add a new data source.

![image](https://user-images.githubusercontent.com/49849754/98451666-bfffec80-20fc-11eb-9165-8100d3a3dd41.png)

Fill out with the username and password respectively

![image](https://user-images.githubusercontent.com/49849754/98451683-e4f45f80-20fc-11eb-8866-9dc21f3624d0.png)

You should now be able to see all the databases and tables.

### Loading sample data

To import data from `init_data.sql`, run this command inside a command prompt. **Make sure the schema is synced, the migrations are ran, and that the tables are empty**.
`psql` should prompt you to enter your password.

E.g.

```
yarn run dropSchema
yarn run syncSchema
yarn run run_migration
yarn run loadSqlData

```

If this command does not work, clear everything inside the tables (delete all tuples in `user_profile` table and cascade delete should remove everything else).
Then open `init_data.sql` inside Intellij, select all the lines, and execute (Ctrl + Enter or Command + Enter).

```
psql -d foodies -f src/main/resources/init_data.sql --username=postgres
or
yarn run loadSqlData
```

### Loading data through typeORM

In `ormconfig.json`, if you set:

```
synchronize: true,
dropSchema: true
```

Then TypeORM will automatically create the schema drop the schema on every application launch
Make sure these lines are uncommented in `App.ts` for TypeORM to save the data when the application starts. After data is loaded,
it is recommended to set `dropSchema: false`.

```
await loadSampleData();
```

## Local development with Docker

Follow the docker instructions on the global `README.md`.

## If you modify any of the entities

- make sure `main/resources/Data.ts` is updated accordingly.
- generate a new `init_data.sql` script.
  1. Load all data using `Data.ts` into the tables.
  2. Select all tables, right click, and select the following:  
     ![image](https://user-images.githubusercontent.com/49849754/98633000-6f8fb700-22d5-11eb-8a02-9726213ebad4.png)
  3. Make note of the location you save these files to and click `Export to File`  
     ![image](https://user-images.githubusercontent.com/49849754/98633026-79191f00-22d5-11eb-833b-da2372a51da8.png)
  4. Copy all the insert statements into `init_data.sql`. Make sure the insertion order is correct (users, promotions, discounts, savedPromotions)  
     ![image](https://user-images.githubusercontent.com/49849754/98633056-8504e100-22d5-11eb-9b24-54af8d87f1b1.png)
  5. Delete the generated files.
