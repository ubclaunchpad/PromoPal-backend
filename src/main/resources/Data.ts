import { Discount } from '../entity/Discount';
import { DiscountType } from '../data/DiscountType';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { Schedule } from '../entity/Schedule';
import { Day } from '../data/Day';
import { Restaurant } from '../entity/Restaurant';

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

const restaurant1 = new Restaurant(
  'ChIJJzFAF9VzhlQRENeLwMlDVl8',
  49.28,
  -123.125
);

const restaurant2 = new Restaurant(
  'ChIJm0jRjMt2hlQRO6rSYKwblRY',
  49.259,
  -123.044
);

const restaurant3 = new Restaurant(
  'ChIJmYf2lX9xhlQRrAQJnKcrQ_M',
  49.282,
  -123.121
);

const restaurant4 = new Restaurant(
  'ChIJt8DHkhx1hlQRhy6OkbWYEe0',
  49.1552321,
  -123.1229737
);

const restaurant5 = new Restaurant(
  'ChIJhRQlLcF3hlQRsvot6GKshBw',
  49.26445,
  -123.005998
);

const restaurant6 = new Restaurant(
  'ChIJ92h_MmJxhlQRmP1gb313vwM',
  49.2715496,
  -123.1067879
);

const restaurant7 = new Restaurant(
  'ChIJCRA00H1xhlQRvQswwLcVNeU',
  49.278532,
  -123.1157544
);

const restaurant8 = new Restaurant(
  'ChIJGWYxCH10hlQRLARrdkVpCsY',
  49.2268328,
  -123.1288101
);

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

const user1 = new User('John', 'Smith', 'user1');
const user2 = new User('Asa', 'Edward', 'user2');
const user3 = new User('Harry', 'James', 'user3');
const user4 = new User('Timothy', 'Dodson', 'user4');
const user5 = new User('Yuri', 'Davis', 'user5');
const user6 = new User('Ethal', 'May', 'user6');
const user7 = new User('Ruby', 'Eleanor', 'user7');

const promotion1 = new Promotion(
  user1,
  discount1,
  restaurant1,
  [schedule1, schedule2],
  PromotionType.SPECIAL_EVENT,
  CuisineType.JAPANESE,
  'Fried Rice for Good - May 10th - 30th',
  `From May 10th to 30th a portion of the proceeds from every order of fried rice sold will be donated to Ronald McDonald House Charities Canada. It’s never been easier to give back - all you have to do is eat your favourite fried rice!
  If you’re looking for more ways to help families you can always round up your order - even when Fried Rice for Good is over. When you finish placing your order, simply ask to “Round Up for RMHC” at participating Gyu-Kaku restaurants, and your order will be rounded to the nearest dollar. The difference will be donated to RMHC Canada.`,
  new Date(),
  new Date()
);
const promotion2 = new Promotion(
  user2,
  discount2,
  restaurant1,
  [schedule3, schedule4],
  PromotionType.HAPPY_HOUR,
  CuisineType.JAPANESE,
  'Happy Hour At Gyu-Kaku',
  'Just for a limited time, happy hour deals starting at 7 pm. Drinks will be 15% off!',
  new Date(),
  new Date()
);
const promotion3 = new Promotion(
  user2,
  discount3,
  restaurant1,
  [schedule5, schedule6],
  PromotionType.OTHER,
  CuisineType.JAPANESE,
  'Spring Promotion Right Now!',
  'Every item on the menu for Gyu-Kaku is cheaper than usual. This promotion runs every Friday',
  new Date(),
  new Date()
);
const promotion4 = new Promotion(
  user2,
  discount4,
  restaurant2,
  [schedule7, schedule8],
  PromotionType.SPECIAL_EVENT,
  CuisineType.AMERICAN,
  'McDonalds: 10% off mobile orders over $20',
  'Lifetime; 10% off mobile orders over $20.00',
  new Date(),
  new Date()
);
const promotion5 = new Promotion(
  user3,
  discount5,
  restaurant2,
  [schedule9, schedule10],
  PromotionType.FREE_ITEM,
  CuisineType.AMERICAN,
  'McDonalds: Free item with pick-up orders',
  'Pick-up only: Over $30 order - free apple pie, over $45 order - free fries, over $65 order: free burger',
  new Date(),
  new Date()
);
const promotion6 = new Promotion(
  user4,
  discount6,
  restaurant3,
  [schedule11],
  PromotionType.OTHER,
  CuisineType.MEXICAN,
  'Chipotle $1.00 Guac starting Monday Apr. 12th',
  'Event starts Monday, April 12th and you can get guac for $1.00.',
  new Date(),
  new Date()
);
const promotion7 = new Promotion(
  user5,
  discount7,
  restaurant4,
  [schedule12],
  PromotionType.FREE_ITEM,
  CuisineType.INDIAN,
  'Ginger: Free curry when ordering through the app',
  'Make an order using the Uber app from 11/23 to 11/29 at participating stores and get a coupon code loaded to your account for a free standard menu size curry.',
  new Date(),
  new Date()
);
const promotion8 = new Promotion(
  user5,
  discount8,
  restaurant5,
  [schedule13],
  PromotionType.FREE_ITEM,
  CuisineType.CHINESE,
  'Yi-Fang: Free Oolong Milk Tea, One Per Day Per Family until May 10th',
  'For us, great boba comes first. Since 2013, we are committed to offering Canadians boba they can confidently enjoy.',
  new Date(),
  new Date()
);
const promotion9 = new Promotion(
  user6,
  discount9,
  restaurant5,
  [schedule14],
  PromotionType.SPECIAL_EVENT,
  CuisineType.CHINESE,
  "50% off Yi Fang's Strawberry Series on Mon, Tues, Wed",
  '50% off all strawberry bubble teas- Monday, Tuesday and Wednesday Only! Online Only (Code 8722).',
  new Date(),
  new Date()
);
const promotion10 = new Promotion(
  user6,
  discount10,
  restaurant5,
  [schedule15, schedule16, schedule17],
  PromotionType.BOGO,
  CuisineType.OTHER,
  'Yi Fang - 50% off 2nd mango slush until Jun 1',
  'Extended until Jun 1. Buy One Large Mango Slush and get the second Mango Slush for 50% off when you order through the Uber App. Use your exclusive promo code “MANGOSLUSH” at checkout.',
  new Date(),
  new Date()
);
const promotion11 = new Promotion(
  user7,
  discount11,
  restaurant5,
  [schedule18],
  PromotionType.SPECIAL_EVENT,
  CuisineType.CHINESE,
  'Yi Fang 30% off Brown Sugar Series @ Dawson St, Vancouver',
  'Brown Sugar Series 30% off at Yi Fang. Cash Only. Only applicable at the Dawson location',
  new Date(),
  new Date()
);
const promotion12 = new Promotion(
  user7,
  discount12,
  restaurant6,
  [schedule19],
  PromotionType.OTHER,
  CuisineType.AMERICAN,
  'Tap & Barrel: $5 meal deal',
  'Every Wednesday in May you can get any starters for $5!',
  new Date(),
  new Date()
);
const promotion13 = new Promotion(
  user7,
  discount13,
  restaurant7,
  [schedule20],
  PromotionType.OTHER,
  CuisineType.JAPANESE,
  'Marutama summer special returns, now includes $10 Maturama Cash voucher',
  'Visit https://marutama.ca/ to get more details',
  new Date(),
  new Date()
);
const promotion14 = new Promotion(
  user7,
  discount14,
  restaurant7,
  [schedule21, schedule22],
  PromotionType.SPECIAL_EVENT,
  CuisineType.JAPANESE,
  'Marutama $2 Yaki Cha-shu',
  'Only valid at 270 Robson St, Vancouver, BC V6B 0E7.',
  new Date(),
  new Date()
);
const promotion15 = new Promotion(
  user7,
  discount15,
  restaurant8,
  [schedule23],
  PromotionType.OTHER,
  CuisineType.JAPANESE,
  'Sushi Mura - Buy a $25 Gift Card Get $10 Bonus Card',
  "From now until June 31st, for every $25 in Gift Cards purchased, get a FREE $10 Bonus Card. Click 'ORDER NOW', or purchase in-store! *Gift Cards valid in BC only. Gift Cards are not valid on date of purchase. Bonus Cards are valid from January 1st to March 15th, 2021. One Bonus Card redemption per table visit.",
  new Date(),
  new Date()
);
const promotion16 = new Promotion(
  user7,
  discount16,
  restaurant8,
  [schedule24, schedule25, schedule26, schedule27],
  PromotionType.HAPPY_HOUR,
  CuisineType.JAPANESE,
  'Sushi Mura Happy Hour – Thursdays are twice as nice',
  'Get two of your favourite rolls for the price of one during Sushi Mura Happy Hour on select Thursdays each month, from 2 p.m. to 7 p.m. at participating stores. Our app is the best place for Happy Hour alerts and offer redemptions. Happy Hour happens every few weeks. But it’s always a Thursday from 2 p.m. to 7 p.m. and it’s always BOGO. And don’t worry, we’ll let you know when it’s happening and add the coupons to your home screen within the app. Make sure to enable push notifications for the app on your phone to receive Happy Hour alerts.',
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

export const restaurants_sample = [
  restaurant1,
  restaurant2,
  restaurant3,
  restaurant4,
  restaurant5,
  restaurant6,
  restaurant7,
  restaurant8,
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
