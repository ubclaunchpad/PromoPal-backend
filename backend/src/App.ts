import express from 'express';
import { createConnection, getRepository, Repository } from 'typeorm';
import bodyParser from 'body-parser';
import { User } from './entity/User';
import { Promotion } from './entity/Promotion';
import { Discount } from './entity/Discount';
import {
  promotions_sample,
  saved_promotions_mapping,
  users_sample,
} from './resources/Data';
import { SavedPromotion } from './entity/SavedPromotion';

/* eslint-disable  no-console */
/* eslint-disable  @typescript-eslint/no-unused-vars */
//todo: ormconfig.json should not have synchronize and drop schema as true for production=
createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(bodyParser.json());
    const PORT = 8000;

    // todo: create custom repositories
    const userRepository: Repository<User> = getRepository(User);
    const promotionRepository: Repository<Promotion> = getRepository(Promotion);
    const discountRepository: Repository<Discount> = getRepository(Discount);

    // persist entities into database
    for (const user of users_sample) {
      await userRepository.save(user);
    }

    for (const promotion of promotions_sample) {
      await promotionRepository.save(promotion);
    }

    for (const [user, promotions] of saved_promotions_mapping) {
      const savedPromotions: SavedPromotion[] = [];
      for (const promotion of promotions) {
        savedPromotions.push(new SavedPromotion(user, promotion));
      }
      user.savedPromotions = savedPromotions;
      await userRepository.save(user);
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
