import { Discount } from '../entity/Discount';
import { DiscountType } from '../data/DiscountType';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { Schedule } from '../entity/Schedule';
import { Day } from '../data/Day';
import { randomLatitude, randomLongitude } from '../../test/utility/Utility';
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
  'A&W',
  '5778 University Blvd, Vancouver, BC V6T 1K6',
  randomLatitude(),
  randomLongitude()
);
const restaurant2 = new Restaurant(
  'Pearl Castle Cafe',
  '6060 Minoru Blvd #1782, Richmond, BC V6Y 2V7',
  randomLatitude(),
  randomLongitude()
);
const restaurant3 = new Restaurant(
  'Wendys',
  '480 W 8th Ave, Vancouver, BC V5Y 1N9',
  randomLatitude(),
  randomLongitude()
);
const restaurant4 = new Restaurant(
  'Saffron Indian Cuisine',
  '4300 Kingsway #5, Burnaby, BC V5H 1Z8',
  randomLatitude(),
  randomLongitude()
);
const restaurant5 = new Restaurant(
  '54th Cafe Restaurant',
  '7088 Kerr St, Vancouver, BC V5S 4W2',
  randomLatitude(),
  randomLongitude()
);
const restaurant6 = new Restaurant(
  'McDonalds',
  '5728 University Blvd #101, Vancouver, BC V6T 1K6',
  randomLatitude(),
  randomLongitude()
);
const restaurant7 = new Restaurant(
  'Starbucks',
  'UBC @ Life, 6138 Student Union Blvd, Vancouver, BC V6T 1Z1',
  randomLatitude(),
  randomLongitude()
);
const restaurant8 = new Restaurant(
  'A&W',
  '467 W Broadway, Vancouver, BC V5Y 1R4',
  randomLatitude(),
  randomLongitude()
);
const restaurant9 = new Restaurant(
  'Dominos',
  '4298 Dunbar St, Vancouver, BC V6S 2E9',
  randomLatitude(),
  randomLongitude()
);
const restaurant10 = new Restaurant(
  'Quesada',
  '4297 Hastings St, Burnaby, BC V5C 2J5',
  randomLatitude(),
  randomLongitude()
);
const restaurant11 = new Restaurant(
  'Katsuya',
  '555 Clarke Rd #8, Coquitlam, BC V3J 3X4',
  randomLatitude(),
  randomLongitude()
);
const restaurant12 = new Restaurant(
  '7 Eleven',
  '2415 E 1st Ave, Vancouver, BC V5M 1A2',
  randomLatitude(),
  randomLongitude()
);
const restaurant13 = new Restaurant(
  'Swiss Chalet',
  '3860 Lougheed Hwy, Burnaby, BC V5C 6N4',
  randomLatitude(),
  randomLongitude()
);
const restaurant14 = new Restaurant(
  'Tea18',
  '6285 Kingsway, Burnaby, BC V5J 0H4',
  randomLatitude(),
  randomLongitude()
);
const restaurant15 = new Restaurant(
  'The Old Spaghetti Factory',
  '53 Water St, Vancouver, BC V6B 1A1',
  randomLatitude(),
  randomLongitude()
);
const restaurant16 = new Restaurant(
  'Starbucks',
  '6200 University Blvd, Vancouver, BC V6T 1Z3',
  randomLatitude(),
  randomLongitude()
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
  restaurant1,
  [schedule1, schedule2],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.CARIBBEAN,
  'Fries for Good - November 10th - 30th',
  `From November 10th to 30th a portion of the proceeds from every order of fries sold will be donated to Ronald McDonald House Charities Canada. All fries, whether bought alone, or in a meal will help! 
  It’s never been easier to give back - all you have to do is eat your favourite fries (120-560 cals)! You can order them in-restaurant, at the drive thru, through McDelivery or you can order ahead on the McDonald’s app.
  If you’re looking for more ways to help families with sick children you can always round up your order - even when Fries for Good is over. When you finish placing your order, simply ask to “Round Up for RMHC” at participating McDonald’s restaurants, and your order will be rounded to the nearest dollar. The difference will be donated to RMHC Canada.`,
  new Date(),
  new Date()
);
const promotion2 = new Promotion(
  user2,
  discount2,
  restaurant2,
  [schedule3, schedule4],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.VIETNAMESE,
  'Happy Hour At Pearl Castle Cafe',
  'Just for a limited time happy hour deals starting at 7 pm. Drinks will be 15% off!',
  new Date(),
  new Date()
);
const promotion3 = new Promotion(
  user2,
  discount3,
  restaurant3,
  [schedule5, schedule6],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.KOREAN,
  'Thanksgiving Promotion Right Now!',
  "Every item on the menu for Wendy's is cheaper than usual. This promotion runs every Friday",
  new Date(),
  new Date()
);
const promotion4 = new Promotion(
  user2,
  discount4,
  restaurant4,
  [schedule7, schedule8],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.JAPANESE,
  'Saffron Indian Cuisine: 10% off pickup orders over $20',
  'Lifetime; 10% off pick up orders over $20.00; #5 - 4300 Kingsway, Burnaby',
  new Date(),
  new Date()
);
const promotion5 = new Promotion(
  user3,
  discount5,
  restaurant5,
  [schedule9, schedule10],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.OTHER,
  '54th Cafe Restaurant: Free items with pick-up orders',
  'Pick-up only: Over $30 order - free spring rolls (2), over $45 order - free fried rice, over $65 order: free honey or dry garlic spareribs;; address is 7088 Kerr Street',
  new Date(),
  new Date()
);
const promotion6 = new Promotion(
  user4,
  discount6,
  restaurant6,
  [schedule11],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.CARIBBEAN,
  'McDonalds $1.00 Coffee any size starting Monday Nov. 30th',
  'Event starts Monday, November 30th and you can get any size McCafé premium roast coffee for $1.00.',
  new Date(),
  new Date()
);
const promotion7 = new Promotion(
  user5,
  discount7,
  restaurant7,
  [schedule12],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.VIETNAMESE,
  'Starbucks Free drink when ordering through the app',
  'Make a purchase using the Starbucks app from 11/23 to 11/29 at participating stores and get a coupon code loaded to your account for a free standard menu size handcrafted drink. Excludes purchases of alcohol, Starbucks Cards and Starbucks Card reloads.',
  new Date(),
  new Date()
);
const promotion8 = new Promotion(
  user5,
  discount8,
  restaurant8,
  [schedule13],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.KOREAN,
  'A&W Free Coffee: One Per Day Per Person until November 30th',
  'For us, great burgers come first. Since 2013 we’ve been serving beef raised without artificial hormones and steroids, and now all our beef is also grass-fed. Grass-fed beef is as simple as it sounds — cattle only graze on grass and other forage, like hay. We source our grass-fed beef from select ranches in Canada, the US, Australia and New Zealand, and are committed to offering Canadians burgers they can confidently enjoy.',
  new Date(),
  new Date()
);
const promotion9 = new Promotion(
  user6,
  discount9,
  restaurant9,
  [schedule14],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.JAPANESE,
  "50% off Domino's on Mon, Tues, Wed",
  '50% off all pizzas- Monday, Tuesday and Wednesday Only! Online Only (Code 8722).',
  new Date(),
  new Date()
);
const promotion10 = new Promotion(
  user6,
  discount10,
  restaurant10,
  [schedule15, schedule16, schedule17],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.OTHER,
  'Quesada - 50% off 2nd large ground beef burrito until Nov 22',
  'Extended until Nov 22. Buy One Large Ground Beef Burrito and get the second Large Ground Beef Burrito for 50% off when you order online at quesada.ca or through the Quesada App. Use your exclusive promo code “GROUNDBEEF” at checkout.',
  new Date(),
  new Date()
);
const promotion11 = new Promotion(
  user7,
  discount11,
  restaurant11,
  [schedule18],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.CARIBBEAN,
  'Katsuya 30% off Takeout @ North York, Scarborough, Yorkdale, Downtown Toronto',
  'Takeout 30% off at Katsuya. Applicable on all their Katsu menu. Cash Only. Only applicable at these following locations: North York, Downtown Toronto, Scarborough, Yorkdale',
  new Date(),
  new Date()
);
const promotion12 = new Promotion(
  user7,
  discount12,
  restaurant12,
  [schedule19],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.VIETNAMESE,
  '7 Eleven $5 meal deal',
  'Every Wednesday in November you can get an 8 inch sub, bag of 7 select chips, and a bottle of AHA water',
  new Date(),
  new Date()
);
const promotion13 = new Promotion(
  user7,
  discount13,
  restaurant13,
  [schedule20],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.KOREAN,
  'Swiss Chalet festive special returns, now includes $10 Chalet Cash voucher. Also BOGO 591ml Pepsi products',
  'Visit https://www.swisschalet.com/en.html to get more details',
  new Date(),
  new Date()
);
const promotion14 = new Promotion(
  user7,
  discount14,
  restaurant14,
  [schedule21, schedule22],
  'ChIJ5xQ7szeuEmsRs6Kj7YFZE9k',
  PromotionType.HAPPY_HOUR,
  CuisineType.JAPANESE,
  'Tea18 $2 Bubble Tea',
  'The store is located at 495 Bloor St West.',
  new Date(),
  new Date()
);
const promotion15 = new Promotion(
  user7,
  discount15,
  restaurant15,
  [schedule23],
  'ChIJb0n5cWl3hlQRIbVGYLiTEgE',
  PromotionType.OTHER,
  CuisineType.OTHER,
  'The Old Spaghetti Factory - Buy a $25 Gift Card Get $10 Bonus Card',
  "From now until December 31st, for every $25 in Gift Cards purchased, get a FREE $10 Bonus Card. Click 'ORDER NOW', or purchase in-store! *Gift Cards valid in Canada only. Gift Cards are not valid on date of purchase. Bonus Cards are valid from January 1st to March 15th, 2021. One Bonus Card redemption per table visit.",
  new Date(),
  new Date()
);
const promotion16 = new Promotion(
  user7,
  discount16,
  restaurant16,
  [schedule24, schedule25, schedule26, schedule27],
  'ChIJIfBAsjeuEmsRdgu9Pl1Ps48',
  PromotionType.BOGO,
  CuisineType.CARIBBEAN,
  'Starbucks Happy Hour – Thursdays are twice as nice',
  'Get two of your favourites for the price of one during Starbucks Happy Hour on select Thursdays each month, from 2 p.m. to 7 p.m. at participating stores. Our app is the best place for Happy Hour alerts and offer redemptions. Happy Hour happens every few weeks. But it’s always a Thursday from 2 p.m. to 7 p.m. and it’s always BOGO. And don’t worry, we’ll let you know when it’s happening and add the coupons to your home screen within the app. Make sure to enable push notifications for the Starbucks app on your phone to receive Happy Hour alerts.',
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
  restaurant9,
  restaurant10,
  restaurant11,
  restaurant12,
  restaurant13,
  restaurant14,
  restaurant14,
  restaurant15,
  restaurant16,
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
