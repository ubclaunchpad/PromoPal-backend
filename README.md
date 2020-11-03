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

