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
  promotionType: string;
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

export enum DayOfWeek {
  Sunday = "SUNDAY",
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
}

export enum Sort {
  Default = "DEFAULT",
  Distance = "DISTANCE",
  MostPopular = "MOST_POPULAR",
  Rating = "RATING",
}

export interface FilterOptions {
  cuisine: string;
  dayOfWeek: DayOfWeek[];
  discountType: string;
  promotionType: string[];
}
