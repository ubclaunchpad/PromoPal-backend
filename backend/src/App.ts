import express from 'express';
import {createConnection, getRepository, Repository} from "typeorm";
import bodyParser from "body-parser";
import {User} from "./entity/User";
import {Promotion} from "./entity/Promotion";
import {Discount} from "./entity/Discount";
import {promotions_sample, saved_promotions_mapping, users_sample} from "./resources/Data";

//todo: ormconfig.json should not have synchronize and drop schema as true for production
createConnection()
    .then(async connection => {
        const app = express();
        app.use(bodyParser.json())
        const PORT = 8000;

        // todo: create custom repositories
        let userRepository: Repository<User> = getRepository(User);
        let promotionRepository: Repository<Promotion> = getRepository(Promotion);
        let discountRepository: Repository<Discount> = getRepository(Discount);

        // persist entities into database
        for (let user of users_sample) {
            await userRepository.save(user);
        }

        for (let promotion of promotions_sample) {
            await promotionRepository.save(promotion)
        }

        for (let [user, promotions] of saved_promotions_mapping) {
            user.savedPromotions = promotions;
            await userRepository.save(user);
        }

        // eager loading (loads everything)
        let users: User[] = await userRepository.find({relations: ["uploadedPromotions", "savedPromotions"]});
        let promotions: Promotion[] = await promotionRepository.find({relations: ["user", "discounts"]});
        let discounts: Discount[] = await discountRepository.find({relations: ["promotion"]});

        // lazy loading (loads only PK)
        let usersLazy: User[] = await userRepository.find({loadRelationIds: true});
        let promotionsLazy: Promotion[] = await promotionRepository.find({loadRelationIds: true});
        let discountsLazy: Discount[] = await discountRepository.find({loadRelationIds: true});

        // define routes
        app.get('/', (req, res) => res.send('Hello World'));
        app.get('/users', async (req, res) => {
            const body = await something();
            res.send(body)
        })
        app.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.log(error)
    });

async function something(): Promise<User[]> {
    let userRepository = getRepository(User);
    return await userRepository.find();
}
