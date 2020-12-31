export interface Promotion {
  id: string;
  category: string;
  cuisine: string;
  dateAdded: string;
  description: string;
  discount: Discount;
  expirationDate: string;
  image: PromotionImage;
  liked: boolean;
  name: string;
  restaurantName: string;
  schedules: Schedule[];
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export interface Discount {
  id: string;
  discountValue: number;
  discountType: string;
}

export interface PromotionImage {
  src: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: DayOfWeek;
  endTime: string;
  startTime: string;
  isRecurring: boolean;
}

export enum CuisineType {
  American = "AMERICAN",
  Chinese = "CHINESE",
  French = "FRENCH",
  Indian = "INDIAN",
  Italian = "ITALIAN",
  Japanese = "JAPANESE",
  Korean = "KOREAN",
  Mexican = "MEXICAN",
  Vietnamese = "VIETNAMESE",
}

export enum DayOfWeek {
  Sunday = "SUNDAY",
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
}

export enum DiscountType {
  DollarsOff = "DOLLARS_OFF",
  PercentOff = "PERCENT_OFF",
}

export enum ServiceOptions {
  DineIn = "DINE_IN",
  TakeOut = "TAKE_OUT",
}

export enum Sort {
  Default = "DEFAULT",
  Distance = "DISTANCE",
  MostPopular = "MOST_POPULAR",
  Rating = "RATING",
}

export interface FilterOptions {
  cuisineType: CuisineType[];
  dayOfWeek: DayOfWeek[];
  discountType: DiscountType[];
  serviceOptions: ServiceOptions[];
}

export type Filter = CuisineType | DayOfWeek | DiscountType | ServiceOptions;
