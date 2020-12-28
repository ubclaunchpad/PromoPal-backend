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

/* eslint-disable  no-console */
/* eslint-disable  @typescript-eslint/no-unused-vars */
//todo: ormconfig.json should not have synchronize and drop schema as true for production
createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(bodyParser.json());
    const PORT = 8000;

    // await loadSampleData();

    registerRouters(app);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

function registerRouters(app: Express) {
  app.get('/', (req, res) => res.send('Hello World'));

  const promotionController = new PromotionController();
  const promotionRouter = new PromotionRouter(promotionController);
  app.use(Route.PROMOTIONS, promotionRouter.getRoutes());

  const enumController = new EnumController();
  const enumRouter = new EnumRouter(enumController);
  app.use(Route.ENUMS, enumRouter.getRoutes());

  const userController = new UserController();
  const userRouter = new UserRouter(userController);
  app.use(Route.USERS, userRouter.getRoutes());
}

/* eslint-disable  @typescript-eslint/no-unused-vars */
async function loadSampleData() {
  const userRepository: UserRepository = getCustomRepository(UserRepository);
  const promotionRepository: PromotionRepository = getCustomRepository(
    PromotionRepository
  );
  const discountRepository: DiscountRepository = getCustomRepository(
    DiscountRepository
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
    relations: ['user', 'discount', 'schedules'],
  });
  const discounts: Discount[] = await discountRepository.find({
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
  const savedPromotionsLazy: SavedPromotion[] = await savedPromotionRepository.find(
    {
      loadRelationIds: true,
    }
  );
  const schedulesLazy: Schedule[] = await scheduleRepository.find({
    loadRelationIds: true,
  });
  console.log();
}
