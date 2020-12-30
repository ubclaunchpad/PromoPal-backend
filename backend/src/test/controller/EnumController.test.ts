import connection from '../repository/BaseRepositoryTest';
import { Express } from 'express';
import request from 'supertest';
import { registerTestApplication } from './BaseController';
import { DiscountType } from '../../main/data/DiscountType';
import { PromotionType } from '../../main/data/PromotionType';
import { CuisineType } from '../../main/data/CuisineType';

describe('Unit tests for PromotionController', function () {
  let app: Express;

  beforeAll(async () => {
    await connection.create();
    app = registerTestApplication();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  test('GET /enums - get values of all supported enums', async () => {
    const supportedEnumStrings = [
      'DiscountType',
      'PromotionType',
      'CuisineType',
    ];
    const supportedEnums = [DiscountType, PromotionType, CuisineType];
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
