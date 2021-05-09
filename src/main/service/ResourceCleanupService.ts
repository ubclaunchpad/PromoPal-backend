import { AWSError, S3 } from 'aws-sdk';
import {
  DeleteObjectOutput,
  DeleteObjectRequest,
  DeleteObjectsOutput,
  DeleteObjectsRequest,
  ObjectIdentifierList,
} from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';

export const DEFAULT_BUCKET = 'promopal';

/**
 * Generic class used to capture external resource cleanup such as deleting files from S3
 * */
export class ResourceCleanupService {
  private s3: S3;

  constructor(s3: S3) {
    this.s3 = s3;
  }

  /**
   * Cleanup any external resources associated with a promotion
   * * E.g. Delete S3 images associated with the promotion
   * @param promotionId the id of the promotion to clean up resources for
   * */
  cleanupResourceForPromotion(
    promotionId: string
  ): Promise<PromiseResult<DeleteObjectOutput, AWSError>> {
    const deleteObjectRequest: DeleteObjectRequest = {
      Bucket: process.env.S3_BUCKET ?? DEFAULT_BUCKET,
      Key: promotionId,
    };

    return this.s3.deleteObject(deleteObjectRequest).promise();
  }

  /**
   * Cleanup any external resources associated with multiple promotions
   * * E.g. Delete S3 images associated with many promotions
   * @param promotionIds the id of the promotions to clean up resources for
   * */
  cleanupResourceForPromotions(
    promotionIds: string[]
  ): Promise<PromiseResult<DeleteObjectsOutput, AWSError>> {
    const objects: ObjectIdentifierList = promotionIds.map((promotionId) => {
      return { Key: promotionId };
    });
    const deleteObjectsRequest: DeleteObjectsRequest = {
      Bucket: process.env.S3_BUCKET ?? DEFAULT_BUCKET,
      Delete: {
        Objects: objects,
      },
    };

    return this.s3.deleteObjects(deleteObjectsRequest).promise();
  }
}
