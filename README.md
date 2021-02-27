# Foodies Backend Project

## Requirements

1. Yarn (https://classic.yarnpkg.com/en/docs/install/)
2. Postgres (https://www.postgresql.org/download/)
   - when installing, use the default password "postgres"
   - for macOS users, suggested installation is through homebrew
3. TypeORM Global Installation (`yarn add typeorm -g`)
   - this will install the TypeORM CLI as well
4. Redis (https://redis.io/download)
   - this is used for local development without Docker

## Before starting

1. Run `yarn install` to install all dependencies

## Configure environment variables

Make a copy of `sample.env`, rename it to `.env`, and fill out the environment variables respectively.
Likely:
```
DB_HOST=localhost
REDIS_HOST=localhost
```

## Setting up databases

You will need two databases, `foodies` and `foodies_test`.

**Ensure you have a `postgres` user setup, and it is your current username**. <br />
_If you do not have this setup, please execute the following command. Otherwise, go to Step 1_.

```
CREATE ROLE postgres WITH LOGIN PASSWORD 'postgres'
```

1. Launch `psql`
2. Connect to localhost and select everything to default. The password should be the same as the one during installation, "postgres".
3. Once logged in, execute the following commands. **Important:** don't forget the semicolons.

```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

ALTER USER postgres CREATEDB;

CREATE DATABASE foodies;

GRANT ALL PRIVILEGES ON DATABASE foodies TO postgres;

CREATE DATABASE foodies_test;

GRANT ALL PRIVILEGES ON DATABASE foodies_test TO postgres;
```

## Unit/Integration tests

Currently, all tests drop the schema after each test. Therefore, do not design tests to be reliant on data from previous tests.

### Running unit tests in IntelliJ

If you want to run all tests in IntelliJ, add this new configuration. It's very important you specify
the working directory as specified because TypeORM config needs the correct directory to find all the entities, migrations, subcribers etc.
![image](https://user-images.githubusercontent.com/49849754/99886688-66ff8080-2bf3-11eb-88b1-2cb9879988db.png)

### Running unit tests in command line

```
yarn run test
```

### Drop the database schema

```
yarn run dropSchema
```

### Sync the database schema

This will setup the schema, without any data.

```
yarn run syncSchema
```

### Run migrations

This will run any migrations in the `/migrations` folder. Currently `ormconfig.ts` is configured to run migrations when the application starts.

```
yarn run run_migration
```

## Local development

### How to build docker container

The following steps assume that you already have Docker installed in your local environment. If you don't have Docker installed, follow [these steps](https://docs.docker.com/compose/install/) before doing anything else.

If this is your first time using Docker, run the following command at the top-level of this repository to build a docker image and activate the containers. Or if there have been any changes to the compose file or Docker file, this command will rebuild the images

```
docker-compose up -d --build
```

If you already have a Docker image, run the following command instead:

```
docker-compose up -d
```

Load the back-end in a container:

```
docker-compose exec web bash
```

Stop docker compose without removing containers

```
docker-compose stop
```

Stops containers and removes containers, networks, volumes, and images created by up. See https://docs.docker.com/compose/reference/down/

```
docker-compose down
```

Removes everything and may help to fix misc Docker errors. WARNING! This will remove: 
- all stopped containers
- all networks not used by at least one container
- all volumes not used by at least one container
- all images without at least one container associated to them
- all build cache

```
docker system prune -a --volumes
```

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

In `ormconfig.ts`, if you set:

```
synchronize: true,
dropSchema: true
```

Then TypeORM will automatically create the schema drop the schema on every application launch.
Make sure this line is uncommented in `App.ts` in the `loadAndCacheSampleData` function for TypeORM to save the data when the application starts. After data is loaded,
it is recommended to set `dropSchema: false`.

```
await loadSampleData();
```

If you find that the cached lat/lon values are not displaying for your promotions, make sure both functions `loadAndCacheSampleData` and `cacheLatLonForSamplePromotions` in `App.ts` are not commented out.

## Local development with Docker

Please note that you must shut down the Docker containers if you intend on
testing locally without Docker afterwards.

### Debugging inside docker

Execute these commands at the **directory containing the docker-compose file** `<roodDir>/foodies`

#### Debugging Postgres

These steps help open the psql cli from the postgres container

```
docker-compose exec db bash // db is the name of the service we specified in the docker-compose.yml file
psql -U postgres -d foodies // now you should be able to use the psql cli for the postgres container
```

#### Debugging Redis

These steps help open the redis-cli from the redis container.
Use the list of commands here https://redis.io/commands

```
docker-compose exec redis-server redis-cli // redis-server is the name of the service we specified in the docker-compose.yml file
```

### Run tests inside docker container

Note we currently don't support this because we have not created the `foodies_test` database in docker-compose. But it should be fairly straightforward to do so

```
docker exec -it foodies_web_1 yarn run test
// or
docker-compose exec web bash
yarn run test
```

### Inspect file system of docker image (https://stackoverflow.com/a/44769468)

```
docker run -it image_name sh
// or if you prefer bash
docker run -it image_name bash
```

## If you modify any of the entities

- make sure `main/resources/Data.ts` is updated accordingly.
- generate a new `init_data.sql` script.
  1. Load all data using `Data.ts` into the tables.
  2. Select all tables, right click, and select the following:  
     ![image](https://user-images.githubusercontent.com/49849754/98633000-6f8fb700-22d5-11eb-8a02-9726213ebad4.png)
  3. Make note of the location you save these files to and click `Export to File`  
     ![image](https://user-images.githubusercontent.com/49849754/98633026-79191f00-22d5-11eb-833b-da2372a51da8.png)
  4. Copy all the insert statements into `init_data.sql`. Make sure the insertion order is correct (users, promotions, discounts, savedPromotions). This is critical as new IDs are created each time.  
     ![image](https://user-images.githubusercontent.com/49849754/98633056-8504e100-22d5-11eb-9b24-54af8d87f1b1.png)
  5. Delete the generated files.

## Setting up Local Redis

To get a local server setup, please refer to the docs here https://redis.io/topics/quickstart.

## Connecting to Redis

If you are interested in using a local Redis server, go to your `.env` and modify the REDIS_HOST field to `localhost`. <br /> <br />
If you would like to connect to the Redis server associated with Docker, modify the REDIS_HOST field to `redis-server`.
