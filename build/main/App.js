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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const body_parser_1 = __importDefault(require("body-parser"));
const Data_1 = require("./resources/Data");
const UserRepository_1 = require("./repository/UserRepository");
const PromotionRepository_1 = require("./repository/PromotionRepository");
const DiscountRepository_1 = require("./repository/DiscountRepository");
const SavedPromotionRepository_1 = require("./repository/SavedPromotionRepository");
const UserRouter_1 = require("./route/UserRouter");
const UserController_1 = require("./controller/UserController");
const Route_1 = require("./constant/Route");
const PromotionRouter_1 = require("./route/PromotionRouter");
const ErrorHandler_1 = require("./middleware/ErrorHandler");
const PromotionController_1 = require("./controller/PromotionController");
const EnumController_1 = require("./controller/EnumController");
const EnumRouter_1 = require("./route/EnumRouter");
const ScheduleRepository_1 = require("./repository/ScheduleRepository");
const redis_1 = __importDefault(require("redis"));
const FirebaseConfig_1 = require("./FirebaseConfig");
const RestaurantRepository_1 = require("./repository/RestaurantRepository");
const GooglePlacesService_1 = require("./service/GooglePlacesService");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const RestaurantController_1 = require("./controller/RestaurantController");
const RestaurantRouter_1 = require("./route/RestaurantRouter");
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const GeocodingService_1 = require("./service/GeocodingService");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ResourceCleanupService_1 = require("./service/ResourceCleanupService");
const FirebaseAuthMiddleware_1 = require("./middleware/FirebaseAuthMiddleware");
class App {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield typeorm_1.createConnection();
                const app = express_1.default();
                const redisClient = yield this.createRedisClient();
                const firebaseAdmin = yield FirebaseConfig_1.initFirebaseAdmin();
                const geocoder = node_geocoder_1.default({
                    provider: 'locationiq',
                    apiKey: process.env.GEOCODING_KEY,
                });
                aws_sdk_1.default.config.update({
                    accessKeyId: process.env.S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                });
                const s3 = new aws_sdk_1.default.S3();
                yield this.registerHandlersAndRoutes(app, redisClient, firebaseAdmin, geocoder, s3);
                yield this.loadSampleDBData();
                const PORT = 8000;
                app.listen(PORT, () => {
                    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    registerHandlersAndRoutes(app, redisClient, firebaseAdmin, nodeGeocoder, s3, axiosInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            app.use(body_parser_1.default.json());
            app.get('/', (req, res) => res.send('Hello World'));
            const resourceCleanupService = new ResourceCleanupService_1.ResourceCleanupService(s3);
            const client = axiosInstance ? new google_maps_services_js_1.Client({ axiosInstance }) : new google_maps_services_js_1.Client();
            const googlesPlaceService = new GooglePlacesService_1.GooglePlacesService(client);
            const restaurantController = new RestaurantController_1.RestaurantController(googlesPlaceService);
            const restaurantRouter = new RestaurantRouter_1.RestaurantRouter(restaurantController);
            const firebaseAuthMiddleware = new FirebaseAuthMiddleware_1.FirebaseAuthMiddleware(firebaseAdmin);
            app.use(Route_1.Route.RESTAURANTS, restaurantRouter.getRoutes());
            const geocodingService = new GeocodingService_1.GeocodingService(nodeGeocoder);
            const promotionController = new PromotionController_1.PromotionController(geocodingService, resourceCleanupService);
            const promotionRouter = new PromotionRouter_1.PromotionRouter(promotionController, firebaseAuthMiddleware);
            app.use(Route_1.Route.PROMOTIONS, promotionRouter.getRoutes());
            const enumController = new EnumController_1.EnumController();
            const enumRouter = new EnumRouter_1.EnumRouter(enumController);
            app.use(Route_1.Route.ENUMS, enumRouter.getRoutes());
            const userController = new UserController_1.UserController(resourceCleanupService);
            const userRouter = new UserRouter_1.UserRouter(userController, firebaseAuthMiddleware);
            app.use(Route_1.Route.USERS, userRouter.getRoutes());
            app.use(ErrorHandler_1.errorHandler);
        });
    }
    loadSampleDBData() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getCustomRepository(UserRepository_1.UserRepository);
            const promotionRepository = typeorm_1.getCustomRepository(PromotionRepository_1.PromotionRepository);
            const discountRepository = typeorm_1.getCustomRepository(DiscountRepository_1.DiscountRepository);
            const restaurantRepository = typeorm_1.getCustomRepository(RestaurantRepository_1.RestaurantRepository);
            const savedPromotionRepository = typeorm_1.getCustomRepository(SavedPromotionRepository_1.SavedPromotionRepository);
            const scheduleRepository = typeorm_1.getCustomRepository(ScheduleRepository_1.ScheduleRepository);
            for (const user of Data_1.users_sample) {
                yield userRepository.save(user);
            }
            for (const promotion of Data_1.promotions_sample) {
                yield promotionRepository.save(promotion);
            }
            for (const [user, promotions] of Data_1.saved_promotions_mapping) {
                yield savedPromotionRepository.addSavedPromotions(user, promotions);
            }
            const users = yield userRepository.find({
                relations: [
                    'uploadedPromotions',
                    'savedPromotions',
                    'savedPromotions.promotion',
                ],
            });
            const promotions = yield promotionRepository.find({
                relations: ['user', 'discount', 'restaurant', 'schedules'],
            });
            const discounts = yield discountRepository.find({
                relations: ['promotion'],
            });
            const restaurants = yield restaurantRepository.find({
                relations: ['promotion'],
            });
            const savedPromotions = yield savedPromotionRepository.find({
                relations: ['user', 'promotion'],
            });
            const schedules = yield scheduleRepository.find({
                relations: ['promotion'],
            });
            const usersLazy = yield userRepository.find({
                loadRelationIds: true,
            });
            const promotionsLazy = yield promotionRepository.find({
                loadRelationIds: true,
            });
            const discountsLazy = yield discountRepository.find({
                loadRelationIds: true,
            });
            const restaurantsLazy = yield restaurantRepository.find({
                loadRelationIds: true,
            });
            const savedPromotionsLazy = yield savedPromotionRepository.find({
                loadRelationIds: true,
            });
            const schedulesLazy = yield scheduleRepository.find({
                loadRelationIds: true,
            });
        });
    }
    createRedisClient() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return redis_1.default.createClient({
                host: (_a = process.env.REDIS_HOST) !== null && _a !== void 0 ? _a : 'localhost',
                port: 6379,
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map