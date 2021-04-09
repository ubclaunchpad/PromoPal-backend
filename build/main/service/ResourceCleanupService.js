"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceCleanupService = exports.S3_BUCKET = void 0;
exports.S3_BUCKET = 'promopal';
class ResourceCleanupService {
    constructor(s3) {
        this.s3 = s3;
    }
    cleanupResourceForPromotion(promotionId) {
        const deleteObjectRequest = {
            Bucket: exports.S3_BUCKET,
            Key: promotionId,
        };
        return this.s3.deleteObject(deleteObjectRequest).promise();
    }
    cleanupResourceForPromotions(promotionIds) {
        const objects = promotionIds.map((promotionId) => {
            return { Key: promotionId };
        });
        const deleteObjectsRequest = {
            Bucket: exports.S3_BUCKET,
            Delete: {
                Objects: objects,
            },
        };
        return this.s3.deleteObjects(deleteObjectsRequest).promise();
    }
}
exports.ResourceCleanupService = ResourceCleanupService;
//# sourceMappingURL=ResourceCleanupService.js.map