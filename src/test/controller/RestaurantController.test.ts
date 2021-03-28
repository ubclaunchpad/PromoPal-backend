import { getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserRepository } from '../../main/repository/UserRepository';
import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { UserFactory } from '../factory/UserFactory';
import {
  connectRedisClient,
  createFirebaseMock,
  registerTestApplication,
} from './BaseController';
import { RedisClient } from 'redis-mock';
import { CustomAxiosMockAdapter } from '../mock/CustomAxiosMockAdapter';
import axios, { AxiosInstance } from 'axios';
import { Place } from '@googlemaps/google-maps-services-js';
import { RestaurantRepository } from '../../main/repository/RestaurantRepository';
import { RestaurantFactory } from '../factory/RestaurantFactory';
import { PromotionFactory } from '../factory/PromotionFactory';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import { Promotion } from '../../main/entity/Promotion';

describe('Unit tests for RestaurantController', function () {
  let userRepository: UserRepository;
  let restaurantRepository: RestaurantRepository;
  let promotionRepository: PromotionRepository;
  let app: Express;
  let mockRedisClient: RedisClient;
  let mockFirebaseAdmin: any;
  let customAxiosMockAdapter: CustomAxiosMockAdapter;
  let axiosInstance: AxiosInstance;

  beforeAll(async () => {
    await connection.create();
    mockRedisClient = await connectRedisClient();
    axiosInstance = axios.create();
    mockFirebaseAdmin = createFirebaseMock();
    app = await registerTestApplication(
      mockRedisClient,
      mockFirebaseAdmin,
      axiosInstance
    );
  });

  afterAll(async () => {
    await connection.close();
    mockRedisClient.quit();
  });

  beforeEach(async () => {
    await connection.clear();
    userRepository = getCustomRepository(UserRepository);
    restaurantRepository = getCustomRepository(RestaurantRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
    customAxiosMockAdapter = new CustomAxiosMockAdapter(axiosInstance);
  });

  test('GET /restaurants/:id/restaurantDetails/', async (done) => {
    const user: User = new UserFactory().generate();
    const restaurant = new RestaurantFactory().generate();

    await userRepository.save(user);
    await restaurantRepository.save(restaurant);

    customAxiosMockAdapter.mockSuccessfulPlaceDetails(restaurant.placeId);

    request(app)
      .get(`/restaurants/${restaurant.id}/restaurantDetails`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails.place_id).toEqual(restaurant.placeId);
        expect(restaurantDetails.name).toEqual('MOCK NAME');
        done();
      });
  });

  test('GET /restaurants/:id/restaurantDetails/ should refresh placeId if not found', async (done) => {
    const expectedRefreshedPlaceId = 'new refreshed placeId';
    const user: User = new UserFactory().generate();
    const restaurant = new RestaurantFactory().generate();

    await userRepository.save(user);
    await restaurantRepository.save(restaurant);

    customAxiosMockAdapter.mockNotFoundPlaceDetails(restaurant.placeId);
    customAxiosMockAdapter.mockSuccessfulRefreshRequest(
      restaurant.placeId,
      expectedRefreshedPlaceId
    );
    customAxiosMockAdapter.mockSuccessfulPlaceDetails(expectedRefreshedPlaceId);

    request(app)
      .get(`/restaurants/${restaurant.id}/restaurantDetails`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get restaurant details with new placeId
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails.place_id).toEqual(expectedRefreshedPlaceId);
        expect(restaurantDetails.name).toEqual('MOCK NAME');

        // placeId should be updated in the repository
        const actualRestaurant = await restaurantRepository.findOneOrFail(
          restaurant.id
        );
        expect(actualRestaurant.placeId).toEqual(expectedRefreshedPlaceId);
        done();
      });
  });

  test('GET /restaurants/:id/restaurantDetails/ should not fail if refresh placeId results in not found', async (done) => {
    const user: User = new UserFactory().generate();
    const restaurant = new RestaurantFactory().generate();

    await userRepository.save(user);
    await restaurantRepository.save(restaurant);

    customAxiosMockAdapter.mockNotFoundPlaceDetails(restaurant.placeId);
    // configure so that refresh request results in not found
    customAxiosMockAdapter.mockNotFoundRefreshRequest(restaurant.placeId);

    request(app)
      .get(`/restaurants/${restaurant.id}/restaurantDetails`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get restaurant details with new placeId
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails).toEqual({});

        // placeId should be updated in the repository
        const actualRestaurant = await restaurantRepository.findOneOrFail(
          restaurant.id
        );
        expect(actualRestaurant.placeId).toEqual('');
        done();
      });
  });

  test('GET /restaurants/:id/restaurantDetails/ should return empty object if placeId is empty string', async (done) => {
    const user: User = new UserFactory().generate();
    const restaurant = new RestaurantFactory().generate();
    restaurant.placeId = '';

    await userRepository.save(user);
    await restaurantRepository.save(restaurant);

    request(app)
      .get(`/restaurants/${restaurant.id}/restaurantDetails`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get restaurant details with new placeId
        const restaurantDetails = res.body as Place;
        expect(restaurantDetails).toEqual({});
        done();
      });
  });

  test('GET /restaurants/:id/promotions should return all promotions for a specified restaurant', async (done) => {
    const user: User = new UserFactory().generate();
    const restaurant = new RestaurantFactory().generate();

    const promotion1 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion2 = new PromotionFactory().generateWithRelatedEntities(user);
    const promotion3 = new PromotionFactory().generateWithRelatedEntities(user);

    promotion1.restaurant = restaurant;
    promotion2.restaurant = restaurant;

    await userRepository.save(user);
    await restaurantRepository.save(restaurant);
    await promotionRepository.save(promotion1);
    await promotionRepository.save(promotion2);
    await promotionRepository.save(promotion3);

    const expectedPromotions = [promotion1, promotion2];

    request(app)
      .get(`/restaurants/${restaurant.id}/promotions`)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        // should be able to get restaurant details with new placeId
        const promotions = res.body as Promotion[];
        expect(promotions.length).toEqual(2);
        for (const expectedPromotion of expectedPromotions) {
          const p = promotions.find(
            (promotion) => promotion.id === expectedPromotion.id
          )!;
          expect(p.discount).toBeDefined();
          expect(p.schedules).toBeDefined();
          expect(p.restaurant).not.toBeDefined();
        }
        done();
      });
  });
});
