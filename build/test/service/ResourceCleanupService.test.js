"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const ResourceCleanupService_1 = require("../../main/service/ResourceCleanupService");
const mock_aws_s3_1 = __importDefault(require("mock-aws-s3"));
describe('Unit tests for ResourceCleanupService', function () {
    let s3;
    let resourceCleanupService;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        s3 = new mock_aws_s3_1.default.S3();
        yield s3.deleteBucket({ Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
        resourceCleanupService = new ResourceCleanupService_1.ResourceCleanupService(s3);
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield s3.deleteBucket({ Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
    }));
    test('Should be able to successfully cleanup resources for a promotion', () => __awaiter(this, void 0, void 0, function* () {
        const sampleKey = '26ca46dc-c430-4fb4-8236-469a2ec4c14a';
        const image = fs.createReadStream(path_1.default.join(__dirname, '..', 'resources', 'sampleImage.jpg'));
        try {
            yield s3
                .putObject({
                Key: sampleKey,
                Body: image,
                Bucket: ResourceCleanupService_1.S3_BUCKET,
            })
                .promise();
            yield s3.getObject({ Key: sampleKey, Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
            yield resourceCleanupService.cleanupResourceForPromotion(sampleKey);
            yield checkObjectDoesNotExist(sampleKey);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to successfully cleanup resources for a promotion even if resource does not exist', () => __awaiter(this, void 0, void 0, function* () {
        const sampleKey = '26ca46dc-c430-4fb4-8236-469a2ec4c14f';
        try {
            yield checkObjectDoesNotExist(sampleKey);
            yield resourceCleanupService.cleanupResourceForPromotion(sampleKey);
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should be able to successfully cleanup resources for multiple promotions at once', () => __awaiter(this, void 0, void 0, function* () {
        const sampleKeys = ['key1', 'key2'];
        try {
            for (const sampleKey of sampleKeys) {
                yield s3
                    .putObject({
                    Key: sampleKey,
                    Body: '{"hello": 1}',
                    Bucket: ResourceCleanupService_1.S3_BUCKET,
                })
                    .promise();
            }
            yield s3.getObject({ Key: sampleKeys[0], Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
            yield resourceCleanupService.cleanupResourceForPromotions(sampleKeys);
            for (const sampleKey of sampleKeys) {
                yield checkObjectDoesNotExist(sampleKey);
            }
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    function checkObjectDoesNotExist(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield s3.getObject({ Key: key, Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
                fail('Should have thrown error');
            }
            catch (e) {
                expect(e.code).toEqual('NoSuchKey');
            }
        });
    }
});
//# sourceMappingURL=ResourceCleanupService.test.js.map