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

/* eslint-disable  no-console */
/* eslint-disable  @typescript-eslint/no-unused-vars */
//todo: ormconfig.json should not have synchronize and drop schema as true for production=
createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(bodyParser.json());
    const PORT = 8000;

    const userRepository: UserRepository = getCustomRepository(UserRepository);
    const promotionRepository: PromotionRepository = getCustomRepository(
      PromotionRepository
    );
    const discountRepository: DiscountRepository = getCustomRepository(
      DiscountRepository
    );

    // persist entities into database (see README.md for more details for loading data)
    for (const user of users_sample) {
      await userRepository.save(user);
    }

    for (const promotion of promotions_sample) {
      await promotionRepository.save(promotion);
    }

    for (const [user, promotions] of saved_promotions_mapping) {
      await userRepository.addSavedPromotions(user, promotions);
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
      relations: ['user', 'discounts'],
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

    // define routes
    app.get('/', (req, res) => res.send('Hello World'));
    app.get('/users', async (req, res) => {
      const body = await something();
      res.send(body);
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
