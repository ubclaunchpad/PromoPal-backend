# Foodies Backend Project

##Requirements
1. Postgres
2. TypeORM Global Installation (`yarn add typeorm -g`)
    - this will install the TypeORM CLI as well

##Before starting
1. Run `yarn install` to install all dependencies


## Configure environment variables
```
Make a copy of `sample.env` and rename it to `.env`.
Fill out the environment variables respectively
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

## Loading sample data
To import data from `init_data.sql`, run this command inside a command prompt. Make sure the schema is setup, and it is currently empty.
`psql` should prompt you to enter your password.
```
psql -d foodies -f src/resources/init_data.sql --username={YOUR_USERNAME}`
```