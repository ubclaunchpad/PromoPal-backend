import express, { Express } from 'express';
import { createConnection, getCustomRepository } from 'typeorm';
import bodyParser from 'body-parser';
import { User } from './entity/User';
import { Promotion } from './entity/Promotion';
import { Discount } from './entity/Discount';
import {
  promotions_sample,
  saved_promotions_mapping,
  users_sample,
} from './resources/Data';
import { UserRepository } from './repository/UserRepository';
import { PromotionRepository } from './repository/PromotionRepository';
import { DiscountRepository } from './repository/DiscountRepository';
import { SavedPromotionRepository } from './repository/SavedPromotionRepository';
import { UserRouter } from './route/UserRouter';
import { UserController } from './controller/UserController';
import { Route } from './constant/Route';
import { PromotionRouter } from './route/PromotionRouter';
import { errorHandler } from './middleware/ErrorHandler';
import { PromotionController } from './controller/PromotionController';
import { EnumController } from './controller/EnumController';
import { EnumRouter } from './route/EnumRouter';
import { ScheduleRepository } from './repository/ScheduleRepository';
import { Schedule } from './entity/Schedule';
import { SavedPromotion } from './entity/SavedPromotion';
import { initFirebaseAdmin } from './FirebaseConfig';
import { RestaurantRepository } from './repository/RestaurantRepository';
import { Restaurant } from './entity/Restaurant';
import { GooglePlacesService } from './service/GooglePlacesService';
import { Client } from '@googlemaps/google-maps-services-js';
import { AxiosInstance } from 'axios';
import { RestaurantController } from './controller/RestaurantController';
import { RestaurantRouter } from './route/RestaurantRouter';
import { auth } from 'firebase-admin/lib/auth';
import Auth = auth.Auth;
import nodeGeocoder from 'node-geocoder';
import { GeocoderConfig, GeocodingService } from './service/GeocodingService';
import AWS, { S3 } from 'aws-sdk';
import { ResourceCleanupService } from './service/ResourceCleanupService';
import { FirebaseAuthMiddleware } from './middleware/FirebaseAuthMiddleware';
import { FirebaseService } from './service/FirebaseService';
import cors from 'cors';

/* eslint-disable  no-console */
/* eslint-disable  @typescript-eslint/no-unused-vars */
//todo: ormconfig.ts should not have synchronize and drop schema as true for production
export class App {
  async init(): Promise<void> {
    try {
      await createConnection();
      const app = express();

      const firebaseAdmin = await initFirebaseAdmin();

      const geocoder = nodeGeocoder({
        provider: 'locationiq',
        apiKey: process.env.GEOCODING_KEY,
      });

      // currently defaulted to Canada
      const geocoderConfig: GeocoderConfig = {
        geocoder: geocoder,
        countryCode: 'ca',
      };

      AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      });
      const s3 = new AWS.S3();

      await this.registerHandlersAndRoutes(
        app,
        firebaseAdmin,
        geocoderConfig,
        s3
      );

      // load sample data
      // await this.loadSampleDBData();

      app.listen(process.env.PORT, () => {
        console.log(
          `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Note: make sure any changes in handlers/routes/controllers will also appear for test/controller/BaseController.ts
   * */
  async registerHandlersAndRoutes(
    app: Express,
    firebaseAdmin: Auth,
    geocoderConfig: GeocoderConfig,
    s3: S3,
    axiosInstance?: AxiosInstance
  ): Promise<void> {
    app.use(bodyParser.json());
    app.use(cors());

    app.get('/', (req, res) => res.send('Hello World'));

    const resourceCleanupService = new ResourceCleanupService(s3);

    const client = axiosInstance ? new Client({ axiosInstance }) : new Client();
    const googlesPlaceService = new GooglePlacesService(client);
    const restaurantController = new RestaurantController(googlesPlaceService);
    const restaurantRouter = new RestaurantRouter(restaurantController);
    const firebaseAuthMiddleware = new FirebaseAuthMiddleware(firebaseAdmin);
    app.use(Route.RESTAURANTS, restaurantRouter.getRoutes());

    const geocodingService = new GeocodingService(geocoderConfig);
    const promotionController = new PromotionController(
      geocodingService,
      resourceCleanupService
    );
    const promotionRouter = new PromotionRouter(
      promotionController,
      firebaseAuthMiddleware
    );
    app.use(Route.PROMOTIONS, promotionRouter.getRoutes());

    const enumController = new EnumController();
    const enumRouter = new EnumRouter(enumController);
    app.use(Route.ENUMS, enumRouter.getRoutes());

    const firebaseService = new FirebaseService(firebaseAdmin);
    const userController = new UserController(
      resourceCleanupService,
      firebaseService
    );
    const userRouter = new UserRouter(userController, firebaseAuthMiddleware);
    app.use(Route.USERS, userRouter.getRoutes());

    // middleware needs to be added at end
    app.use(errorHandler);
  }

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  async loadSampleDBData(): Promise<void> {
    const userRepository: UserRepository = getCustomRepository(UserRepository);
    const promotionRepository: PromotionRepository = getCustomRepository(
      PromotionRepository
    );
    const discountRepository: DiscountRepository = getCustomRepository(
      DiscountRepository
    );
    const restaurantRepository: RestaurantRepository = getCustomRepository(
      RestaurantRepository
    );
    const savedPromotionRepository: SavedPromotionRepository = getCustomRepository(
      SavedPromotionRepository
    );
    const scheduleRepository: ScheduleRepository = getCustomRepository(
      ScheduleRepository
    );

    // persist entities into database (see README.md for more details for loading data)
    for (const user of users_sample) {
      await userRepository.save(user);
    }

    for (const promotion of promotions_sample) {
      await promotionRepository.save(promotion);
    }

    for (const [user, promotions] of saved_promotions_mapping) {
      await savedPromotionRepository.addSavedPromotions(user, promotions);
    }

    // eager loading (loads everything)
    const users: User[] = await userRepository.find({
      relations: [
        'uploadedPromotions',
        'savedPromotions',
        'savedPromotions.promotion',
      ],
    }); // see https://stackoverflow.com/questions/61236129/typeorm-custom-many-to-many-not-pulling-relation-data
    const promotions: Promotion[] = await promotionRepository.find({
      relations: ['user', 'discount', 'restaurant', 'schedules'],
    });
    const discounts: Discount[] = await discountRepository.find({
      relations: ['promotion'],
    });
    const restaurants: Restaurant[] = await restaurantRepository.find({
      relations: ['promotion'],
    });
    const savedPromotions: SavedPromotion[] = await savedPromotionRepository.find(
      {
        relations: ['user', 'promotion'],
      }
    );
    const schedules: Schedule[] = await scheduleRepository.find({
      relations: ['promotion'],
    });

    // lazy loading (loads only PK)
    const usersLazy: User[] = await userRepository.find({
      loadRelationIds: true,
    });
    const promotionsLazy: Promotion[] = await promotionRepository.find({
      loadRelationIds: true,
    });
    const discountsLazy: Discount[] = await discountRepository.find({
      loadRelationIds: true,
    });
    const restaurantsLazy: Restaurant[] = await restaurantRepository.find({
      loadRelationIds: true,
    });
    const savedPromotionsLazy: SavedPromotion[] = await savedPromotionRepository.find(
      {
        loadRelationIds: true,
      }
    );
    const schedulesLazy: Schedule[] = await scheduleRepository.find({
      loadRelationIds: true,
    });
  }
}
