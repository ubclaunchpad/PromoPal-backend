import express from 'express';
import {createConnection, getRepository, Repository} from "typeorm";
import bodyParser from "body-parser";
import {User} from "./entity/User";
import {Promotion} from "./entity/Promotion";
import {Discount} from "./entity/Discount";
import {DiscountType} from "./data/DiscountType";
import {PromotionCategory} from "./data/PromotionCategory";
import {CuisineType} from "./data/CuisineType";

//todo: ormconfig.json should not have synchronize and drop schema as true for production
createConnection()
    .then(async connection => {
        const app = express();
        app.use(bodyParser.json())
        const PORT = 8000;

        // creating sample data
        // todo: refactor to make cleaner
        const discount1 = new Discount(DiscountType.PERCENTAGE, 50.5);
        const discount2 = new Discount(DiscountType.AMOUNT, 2);
        const discount3 = new Discount(DiscountType.AMOUNT, 3);
        const discount4 = new Discount(DiscountType.PERCENTAGE, 19.99);

        const user1 = new User("user1", "test", "user1Email", "user1_userName", "user1_password");
        const user2 = new User("user2", "test", "user2Email", "user2_userName", "user2_password");

        const promotion1 = new Promotion(user1, [discount3], PromotionCategory.BOGO, CuisineType.CARIBBEAN, "promo1", "test", new Date(), "$")
        const promotion2 = new Promotion(user2, [discount1, discount2], PromotionCategory.HAPPY_HOUR, CuisineType.JAPANESE, "promo2", "test", new Date(), "$")
        const promotion3 = new Promotion(user1, [discount4], PromotionCategory.BOGO, CuisineType.KOREAN, "promo3", "test", new Date(), "$")

        // todo: create custom repositories
        let userRepository: Repository<User> = getRepository(User);
        let promotionRepository: Repository<Promotion> = getRepository(Promotion);
        let discountRepository: Repository<Discount> = getRepository(Discount);

        // persist entities into database
        await userRepository.save(user1);
        await userRepository.save(user2);
        await promotionRepository.save(promotion1);
        await promotionRepository.save(promotion2);
        await promotionRepository.save(promotion3);

        // if user1 wants to add promotion to savedPromotions, this works because of { cascade: true } in User,
        user1.savedPromotions = [promotion1];
        await userRepository.save(user1);

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
