import { Discount } from '../entity/Discount';
import { DiscountType } from '../data/DiscountType';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { Schedule } from '../entity/Schedule';
import { Day } from '../data/Day';

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

const schedule1 = new Schedule('8:00', '11:00', Day.MONDAY, false);
const schedule2 = new Schedule('9:00', '12:00', Day.TUESDAY, false);
const schedule3 = new Schedule('10:00', '13:00', Day.WEDNESDAY, false);
const schedule4 = new Schedule('11:00', '14:00', Day.THURSDAY, false);
const schedule5 = new Schedule('12:00', '15:00', Day.FRIDAY, false);
const schedule6 = new Schedule('13:00', '16:00', Day.SATURDAY, false);
const schedule7 = new Schedule('14:00', '17:00', Day.SUNDAY, false);
const schedule8 = new Schedule('15:00', '18:00', Day.MONDAY, true);
const schedule9 = new Schedule('16:00', '19:00', Day.TUESDAY, true);
const schedule10 = new Schedule('17:00', '20:00', Day.WEDNESDAY, true);
const schedule11 = new Schedule('18:00', '21:00', Day.THURSDAY, true);
const schedule12 = new Schedule('19:00', '22:00', Day.FRIDAY, true);
const schedule13 = new Schedule('20:00', '23:00', Day.SATURDAY, true);
const schedule14 = new Schedule('21:00', '24:00', Day.SUNDAY, true);
const schedule15 = new Schedule('8:30', '10:30', Day.MONDAY, true);
const schedule16 = new Schedule('9:30', '11:30', Day.TUESDAY, true);
const schedule17 = new Schedule('10:30', '12:30', Day.WEDNESDAY, false);
const schedule18 = new Schedule('11:30', '13:30', Day.TUESDAY, false);
const schedule19 = new Schedule('12:30', '14:30', Day.WEDNESDAY, false);
const schedule20 = new Schedule('13:30', '15:30', Day.THURSDAY, false);
const schedule21 = new Schedule('14:30', '16:30', Day.FRIDAY, false);
const schedule22 = new Schedule('15:30', '17:30', Day.SATURDAY, false);
const schedule23 = new Schedule('16:30', '18:30', Day.SUNDAY, false);
const schedule24 = new Schedule('1:45', '6:10', Day.MONDAY, true);
const schedule25 = new Schedule('2:15', '7:23', Day.TUESDAY, true);
const schedule26 = new Schedule('3:45', '8:15', Day.WEDNESDAY, true);
const schedule27 = new Schedule('4:42', '9:16', Day.THURSDAY, true);

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
  [schedule1, schedule2],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.CARIBBEAN,
  'promo1',
  'description1',
  new Date(),
  new Date()
);
const promotion2 = new Promotion(
  user2,
  discount2,
  [schedule3, schedule4],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.VIETNAMESE,
  'promo2',
  'description2',
  new Date(),
  new Date()
);
const promotion3 = new Promotion(
  user2,
  discount3,
  [schedule5, schedule6],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.KOREAN,
  'promo3',
  'description3',
  new Date(),
  new Date()
);
const promotion4 = new Promotion(
  user2,
  discount4,
  [schedule7, schedule8],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.JAPANESE,
  'promo4',
  'description4',
  new Date(),
  new Date()
);
const promotion5 = new Promotion(
  user3,
  discount5,
  [schedule9, schedule10],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.OTHER,
  'promo5',
  'description5',
  new Date(),
  new Date()
);
const promotion6 = new Promotion(
  user4,
  discount6,
  [schedule11],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.CARIBBEAN,
  'promo6',
  'description6',
  new Date(),
  new Date()
);
const promotion7 = new Promotion(
  user5,
  discount7,
  [schedule12],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.VIETNAMESE,
  'promo7',
  'description7',
  new Date(),
  new Date()
);
const promotion8 = new Promotion(
  user5,
  discount8,
  [schedule13],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.KOREAN,
  'promo8',
  'description8',
  new Date(),
  new Date()
);
const promotion9 = new Promotion(
  user6,
  discount9,
  [schedule14],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.JAPANESE,
  'promo9',
  'description9',
  new Date(),
  new Date()
);
const promotion10 = new Promotion(
  user6,
  discount10,
  [schedule15, schedule16, schedule17],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.OTHER,
  'promo10',
  'description10',
  new Date(),
  new Date()
);
const promotion11 = new Promotion(
  user7,
  discount11,
  [schedule18],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.CARIBBEAN,
  'promo11',
  'description11',
  new Date(),
  new Date()
);
const promotion12 = new Promotion(
  user7,
  discount12,
  [schedule19],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.VIETNAMESE,
  'promo12',
  'description12',
  new Date(),
  new Date()
);
const promotion13 = new Promotion(
  user7,
  discount13,
  [schedule20],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.KOREAN,
  'promo13',
  'description13',
  new Date(),
  new Date()
);
const promotion14 = new Promotion(
  user7,
  discount14,
  [schedule21, schedule22],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.JAPANESE,
  'promo14',
  'description14',
  new Date(),
  new Date()
);
const promotion15 = new Promotion(
  user7,
  discount15,
  [schedule23],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.OTHER,
  'promo15',
  'description15',
  new Date(),
  new Date()
);
const promotion16 = new Promotion(
  user7,
  discount16,
  [schedule24, schedule25, schedule26, schedule27],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.CARIBBEAN,
  'promo16',
  'description16',
  new Date(),
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

export const schedules_sample = [
  schedule1,
  schedule2,
  schedule3,
  schedule4,
  schedule5,
  schedule6,
  schedule7,
  schedule8,
  schedule9,
  schedule10,
  schedule11,
  schedule12,
  schedule13,
  schedule14,
  schedule15,
  schedule16,
  schedule17,
  schedule18,
  schedule19,
  schedule20,
  schedule21,
  schedule22,
  schedule23,
  schedule24,
  schedule25,
  schedule26,
  schedule27,
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
