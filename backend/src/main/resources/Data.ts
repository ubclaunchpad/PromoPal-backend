import { Discount } from '../entity/Discount';
import { DiscountType } from '../data/DiscountType';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { PromotionCategory } from '../data/PromotionCategory';
import { CuisineType } from '../data/CuisineType';

const discount1 = new Discount(DiscountType.PERCENTAGE, 1);
const discount2 = new Discount(DiscountType.PERCENTAGE, 2);
const discount3 = new Discount(DiscountType.AMOUNT, 3.99);
const discount4 = new Discount(DiscountType.AMOUNT, 4);
const discount5 = new Discount(DiscountType.PERCENTAGE, 5.6);
const discount6 = new Discount(DiscountType.PERCENTAGE, 6);
const discount7 = new Discount(DiscountType.AMOUNT, 7);
const discount8 = new Discount(DiscountType.AMOUNT, 8);
const discount9 = new Discount(DiscountType.PERCENTAGE, 9);
const discount10 = new Discount(DiscountType.PERCENTAGE, 10);
const discount11 = new Discount(DiscountType.AMOUNT, 11);
const discount12 = new Discount(DiscountType.AMOUNT, 12);
const discount13 = new Discount(DiscountType.PERCENTAGE, 13);
const discount14 = new Discount(DiscountType.PERCENTAGE, 14);
const discount15 = new Discount(DiscountType.AMOUNT, 15);
const discount16 = new Discount(DiscountType.AMOUNT, 16);

const user1 = new User(
  'John',
  'Smith',
  'smith.j@sample.com',
  'user1',
  'user1_password'
);
const user2 = new User(
  'Asa',
  'Edward',
  'edward.a@sample.com',
  'user2',
  'user2_password'
);
const user3 = new User(
  'Harry',
  'James',
  'james.h@sample.com',
  'user3',
  'user3_password'
);
const user4 = new User(
  'Timothy',
  'Dodson',
  'dodson.t@sample.com',
  'user4',
  'user4_password'
);
const user5 = new User(
  'Yuri',
  'Davis',
  'davis.y@sample.com',
  'user5',
  'user5_password'
);
const user6 = new User(
  'Ethal',
  'May',
  'may.e@sample.com',
  'user6',
  'user6_password'
);
const user7 = new User(
  'Ruby',
  'Eleanor',
  'eleanor.r@sample.com',
  'user7',
  'user7_password'
);

const promotion1 = new Promotion(
  user1,
  discount1,
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionCategory.BOGO,
  CuisineType.CARIBBEAN,
  'promo1',
  'description1',
  new Date()
);
const promotion2 = new Promotion(
  user2,
  discount2,
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionCategory.HAPPY_HOUR,
  CuisineType.VIETNAMESE,
  'promo2',
  'description2',
  new Date()
);
const promotion3 = new Promotion(
  user2,
  discount3,
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionCategory.OTHER,
  CuisineType.KOREAN,
  'promo3',
  'description3',
  new Date()
);
const promotion4 = new Promotion(
  user2,
  discount4,
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionCategory.BOGO,
  CuisineType.JAPANESE,
  'promo4',
  'description4',
  new Date()
);
const promotion5 = new Promotion(
  user3,
  discount5,
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionCategory.HAPPY_HOUR,
  CuisineType.OTHER,
  'promo5',
  'description5',
  new Date()
);
const promotion6 = new Promotion(
  user4,
  discount6,
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionCategory.OTHER,
  CuisineType.CARIBBEAN,
  'promo6',
  'description6',
  new Date()
);
const promotion7 = new Promotion(
  user5,
  discount7,
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionCategory.BOGO,
  CuisineType.VIETNAMESE,
  'promo7',
  'description7',
  new Date()
);
const promotion8 = new Promotion(
  user5,
  discount8,
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionCategory.HAPPY_HOUR,
  CuisineType.KOREAN,
  'promo8',
  'description8',
  new Date()
);
const promotion9 = new Promotion(
  user6,
  discount9,
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionCategory.OTHER,
  CuisineType.JAPANESE,
  'promo9',
  'description9',
  new Date()
);
const promotion10 = new Promotion(
  user6,
  discount10,
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionCategory.BOGO,
  CuisineType.OTHER,
  'promo10',
  'description10',
  new Date()
);
const promotion11 = new Promotion(
  user7,
  discount11,
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionCategory.HAPPY_HOUR,
  CuisineType.CARIBBEAN,
  'promo11',
  'description11',
  new Date()
);
const promotion12 = new Promotion(
  user7,
  discount12,
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionCategory.OTHER,
  CuisineType.VIETNAMESE,
  'promo12',
  'description12',
  new Date()
);
const promotion13 = new Promotion(
  user7,
  discount13,
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionCategory.BOGO,
  CuisineType.KOREAN,
  'promo13',
  'description13',
  new Date()
);
const promotion14 = new Promotion(
  user7,
  discount14,
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionCategory.HAPPY_HOUR,
  CuisineType.JAPANESE,
  'promo14',
  'description14',
  new Date()
);
const promotion15 = new Promotion(
  user7,
  discount15,
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionCategory.OTHER,
  CuisineType.OTHER,
  'promo15',
  'description15',
  new Date()
);
const promotion16 = new Promotion(
  user7,
  discount16,
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionCategory.BOGO,
  CuisineType.CARIBBEAN,
  'promo16',
  'description16',
  new Date()
);

export const discounts_sample = [
  discount1,
  discount2,
  discount3,
  discount4,
  discount5,
  discount6,
  discount7,
  discount8,
  discount9,
  discount10,
  discount11,
  discount12,
  discount13,
  discount14,
  discount14,
  discount15,
  discount16,
];
export const users_sample = [user1, user2, user3, user4, user5, user6, user7];
export const promotions_sample = [
  promotion1,
  promotion2,
  promotion3,
  promotion4,
  promotion5,
  promotion6,
  promotion7,
  promotion8,
  promotion9,
  promotion10,
  promotion11,
  promotion12,
  promotion13,
  promotion14,
  promotion15,
  promotion16,
];

export const saved_promotions_mapping: Map<User, Promotion[]> = new Map([
  [
    user1,
    [promotion1, promotion2, promotion3, promotion4, promotion7, promotion8],
  ],
  [
    user2,
    [promotion1, promotion2, promotion3, promotion4, promotion5, promotion6],
  ],
  [user3, [promotion1, promotion7, promotion8]],
  [user4, [promotion1, promotion9, promotion10]],
  [user5, [promotion1, promotion10, promotion11, promotion2, promotion3]],
  [
    user6,
    [
      promotion1,
      promotion11,
      promotion12,
      promotion13,
      promotion14,
      promotion15,
      promotion16,
    ],
  ],
  [user7, promotions_sample],
]);
