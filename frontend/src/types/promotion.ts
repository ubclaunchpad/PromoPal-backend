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
  type: string;
}

export interface PromotionImage {
  src: string;
}

export enum Category {
  Bakery = "BAKERY",
  BubbleTea = "BUBBLE_TEA",
  Coffee = "COFFEE",
  Dessert = "DESSERT",
  FastFood = "FAST_FOOD",
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

export enum DaysOfWeek {
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
  Distance = "DISTANCE",
  MostPopular = "MOST_POPULAR",
  Rating = "RATING",
}

export type FilterBy =
  | "DEFAULT"
  | Category
  | CuisineType
  | DaysOfWeek
  | DiscountType
  | ServiceOptions;
export type SortBy = "DEFAULT" | Sort;
