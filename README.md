# Foodies

Finding the best restaurant promotions and deals while supporting local 🍔

### How to build docker container
The following steps assume that you already have Docker installed in your local environment. If you don't have Docker installed, follow [these steps](https://docs.docker.com/compose/install/) before doing anything else.

If this is your first time using Docker, run the following command at the top-level of this repository to build a docker image and activate the containers:
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

### How to setup sample db
The following steps assume that you are first time to create schema and data. If you have created once, you don't have to do unless you remove **tmp/db/** directory

After you have built and run the docker container, make sure the container **foodies_db_1```** is 'Up' status.

To get into database server, run the following command
```
docker-comopse exec db bash
```
Then, in order to create schema first, run the following command
```
PASSWORD=admin psql -U admin -h localhost -p 5432 -d foodies -f db/schema.sql

```
If you don't get any error, run the following command to create sample data
```
PASSWORD=admin psql -U admin -h localhost -p 5432 -d foodies < db/data.sql

```