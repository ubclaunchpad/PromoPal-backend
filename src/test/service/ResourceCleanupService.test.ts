import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import path from 'path';
import {
  ResourceCleanupService,
  DEFAULT_BUCKET,
} from '../../main/service/ResourceCleanupService';
import AWSMock from 'mock-aws-s3';

describe('Unit tests for ResourceCleanupService', function () {
  let s3: S3;
  let resourceCleanupService: ResourceCleanupService;

  beforeEach(async () => {
    s3 = new AWSMock.S3();
    await s3.deleteBucket({ Bucket: DEFAULT_BUCKET }).promise();
    resourceCleanupService = new ResourceCleanupService(s3);
  });

  afterAll(async () => {
    await s3.deleteBucket({ Bucket: DEFAULT_BUCKET }).promise();
  });

  test('Should be able to successfully cleanup resources for a promotion', async () => {
    const sampleKey = '26ca46dc-c430-4fb4-8236-469a2ec4c14a';
    const image = fs.createReadStream(
      path.join(__dirname, '..', 'resources', 'sampleImage.jpg')
    );

    try {
      await s3
        .putObject({
          Key: sampleKey,
          Body: image,
          Bucket: DEFAULT_BUCKET,
        })
        .promise();

      // should be able to successfully get the object
      await s3.getObject({ Key: sampleKey, Bucket: DEFAULT_BUCKET }).promise();

      await resourceCleanupService.cleanupResourceForPromotion(sampleKey);
      await checkObjectDoesNotExist(sampleKey);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to successfully cleanup resources for a promotion even if resource does not exist', async () => {
    const sampleKey = '26ca46dc-c430-4fb4-8236-469a2ec4c14f';
    try {
      await checkObjectDoesNotExist(sampleKey);
      await resourceCleanupService.cleanupResourceForPromotion(sampleKey);
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should be able to successfully cleanup resources for multiple promotions at once', async () => {
    const sampleKeys = ['key1', 'key2'];

    try {
      for (const sampleKey of sampleKeys) {
        await s3
          .putObject({
            Key: sampleKey,
            Body: '{"hello": 1}',
            Bucket: DEFAULT_BUCKET,
          })
          .promise();
      }

      // should be able to successfully get the object
      await s3
        .getObject({ Key: sampleKeys[0], Bucket: DEFAULT_BUCKET })
        .promise();

      await resourceCleanupService.cleanupResourceForPromotions(sampleKeys);
      for (const sampleKey of sampleKeys) {
        await checkObjectDoesNotExist(sampleKey);
      }
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  async function checkObjectDoesNotExist(key: string) {
    try {
      await s3.getObject({ Key: key, Bucket: DEFAULT_BUCKET }).promise();
      fail('Should have thrown error');
    } catch (e) {
      expect(e.code).toEqual('NoSuchKey');
    }
  }
});
