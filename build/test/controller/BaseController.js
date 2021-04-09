"use strict";
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
exports.BaseController = void 0;
const express_1 = __importDefault(require("express"));
const App_1 = require("../../main/App");
const redis_mock_1 = __importDefault(require("redis-mock"));
const firebaseMock = require('firebase-mock');
const axios_1 = __importDefault(require("axios"));
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const mock_aws_s3_1 = __importDefault(require("mock-aws-s3"));
const ResourceCleanupService_1 = require("../../main/service/ResourceCleanupService");
class BaseController {
    constructor() {
        this.registerTestApplication = () => __awaiter(this, void 0, void 0, function* () {
            const app = new App_1.App();
            const expressApp = express_1.default();
            yield app.registerHandlersAndRoutes(expressApp, this.mockRedisClient, this.mockFirebaseAdmin, this.mockGeoCoder, this.mockS3, this.axiosInstance);
            yield this.mockS3.deleteBucket({ Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
            yield this.mockFirebaseAdmin.autoFlush();
            yield this.createAuthenticatedUser();
            return expressApp;
        });
        this.quit = () => __awaiter(this, void 0, void 0, function* () {
            this.mockRedisClient.quit();
            yield this.mockS3.deleteBucket({ Bucket: ResourceCleanupService_1.S3_BUCKET }).promise();
        });
        this.mockRedisClient = BaseController.createRedisMock();
        this.mockFirebaseAdmin = BaseController.createFirebaseMock();
        this.mockGeoCoder = BaseController.createMockNodeGeocoder();
        this.mockS3 = BaseController.createS3Mock();
        this.axiosInstance = axios_1.default.create();
    }
    createAuthenticatedUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.mockFirebaseAdmin.createUser({
                email: 'test@gmail.com',
                password: 'testpassword',
            });
            this.idToken = yield user.getIdToken();
            this.firebaseId = user.uid;
        });
    }
}
exports.BaseController = BaseController;
BaseController.createRedisMock = () => {
    return redis_mock_1.default.createClient();
};
BaseController.createFirebaseMock = () => {
    const mockAuth = new firebaseMock.MockAuthentication();
    const mockDatabase = new firebaseMock.MockFirebase();
    const mockStorage = new firebaseMock.MockStorage();
    const mockSdk = new firebaseMock.MockFirebaseSdk((path) => {
        return path ? mockDatabase.child(path) : mockDatabase;
    }, () => {
        return mockAuth;
    }, null, () => {
        return mockStorage;
    }, null);
    return mockSdk.auth();
};
BaseController.createMockNodeGeocoder = () => {
    return node_geocoder_1.default({
        provider: 'openstreetmap',
    });
};
BaseController.createS3Mock = () => {
    return new mock_aws_s3_1.default.S3();
};
//# sourceMappingURL=BaseController.js.map