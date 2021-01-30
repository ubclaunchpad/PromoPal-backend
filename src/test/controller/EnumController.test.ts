import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { connectRedisClient, registerTestApplication } from './BaseController';
import { DiscountType } from '../../main/data/DiscountType';
import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';
import { Day } from '../../main/data/Day';
import { RedisClient } from 'redis-mock';

describe('Unit tests for PromotionController', function () {
  let app: Express;
  let redisClient: RedisClient;

  beforeAll(async () => {
    await connection.create();
    redisClient = await connectRedisClient();
    app = await registerTestApplication(redisClient);
  });

  afterAll(async () => {
    await connection.close();
    redisClient.quit();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  test('GET /enums - get values of all supported enums', async () => {
    const supportedEnumStrings = [
      'DiscountType',
      'PromotionType',
      'CuisineType',
      'Day',
    ];
    const supportedEnums = [DiscountType, PromotionType, CuisineType, Day];
    const promises: Promise<any>[] = [];
    for (let i = 0; i < supportedEnums.length; i++) {
      const bodyFunction = (res: request.Response) => {
        const values = res.body;
        expect(values).toMatchObject(Object.values(supportedEnums[i]));
      };
      promises.push(
        request(app)
          .get(`/enums/${supportedEnumStrings[i]}`)
          .expect(200)
          .expect(bodyFunction)
      );
    }
    await Promise.all(promises);
  });
});
