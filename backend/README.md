# Foodies Backend Project

## Requirements

1. Postgres
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

You will need two databases, `foodies` and `foodies_test`

```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

ALTER USER postgres CREATEDB;

// repeat these two lines for both databases
CREATE DATABASE foodies;

GRANT ALL PRIVILEGES ON DATABASE foodies TO postgres;
```

## Drop the database schema:

```
yarn run dropSchema
```

## Sync the database schema

This will setup the schema, without any data.

```
yarn run syncSchema
```

## Local development (without docker)

### Change ormconfig.json

Find `ormconfig.json` and change the following line to `host: localhost`

### Using Intellij

Make sure you created the databases first.
Intellij can show you your databases and tables. Go to the `Database` tab and add a new data source.  
![image](https://user-images.githubusercontent.com/49849754/98451666-bfffec80-20fc-11eb-9165-8100d3a3dd41.png)

Fill out with the username and password respectively
![image](https://user-images.githubusercontent.com/49849754/98451683-e4f45f80-20fc-11eb-8866-9dc21f3624d0.png)

You should now be able to see all the databases and tables.

### Loading sample data

To import data from `init_data.sql`, run this command inside a command prompt. Make sure the schema is setup, and it is currently empty.
`psql` should prompt you to enter your password.

```
psql -d foodies -f src/resources/init_data.sql --username={YOUR_USERNAME}`
```

### Loading data through typeORM

In `ormconfig.json`, if you set:

```
synchronize: true,
dropSchema: true
```

Then TypeORM will automatically create the schema drop the schema on every application launch
Make sure these lines are uncommented for TypeORM to save the data in `App.ts`

```
// persist entities into database
for (const user of users_sample) {
  await userRepository.save(user);
}

for (const promotion of promotions_sample) {
  await promotionRepository.save(promotion);
}

for (const [user, promotions] of saved_promotions_mapping) {
  const savedPromotions: SavedPromotion[] = [];
  for (const promotion of promotions) {
    savedPromotions.push(new SavedPromotion(user, promotion));
  }
  user.savedPromotions = savedPromotions;
  await userRepository.save(user);
}
```

## Local development with Docker

Follow the docker instructions on the global `README.md`.
