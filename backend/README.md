## Foodies Backend Project

Requirements
1. Postgres
2. TypeORM Global Installation (`yarn add typeorm -g`)
    - this will install the TypeORM CLI as well

##### To import data from `init_data.sql`, run this command inside a command prompt. Make sure the schema is setup and it is currently empty

> `psql -d foodies -f src/resources/init_data.sql --username={YOUR_USERNAME}`
>
> `psql` should prompt you to enter your password.

##### To drop the database schema, run:
>`yarn run dropSchema`

##### To sync the database schema, run: (this will setup the schema, without any data)
 >`yarn run syncSchema`