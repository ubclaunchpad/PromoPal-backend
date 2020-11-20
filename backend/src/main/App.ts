import express from 'express';
import { createConnection, getCustomRepository, getRepository } from 'typeorm';
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

/* eslint-disable  no-console */
/* eslint-disable  @typescript-eslint/no-unused-vars */
//todo: ormconfig.json should not have synchronize and drop schema as true for production
createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(bodyParser.json());
    const PORT = 8000;

    registerRouters(app);

    function registerRouters(app: express.Express) {
      const userController = new UserController();
      const userRouter = new UserRouter(userController);
      app.use(Route.USERS, userRouter.getRoutes());
    }

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
      relations: ['user', 'discount'],
    });
    const discounts: Discount[] = await discountRepository.find({
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

    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

async function something(): Promise<User[]> {
  const userRepository = getRepository(User);
  return await userRepository.find();
}
