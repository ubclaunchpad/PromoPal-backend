# Foodies

Finding the best restaurant promotions and deals while supporting local 🍔

### How to build docker container
assume you have installed docker on your local environment

Only first time, build an docker image and activate containers
```
docker-compose up -d --build
```
If you already have docker image
```
docker-compose up -d
```
2. get into the conainer (for backend)
```
docker-compose exec web bash
```
