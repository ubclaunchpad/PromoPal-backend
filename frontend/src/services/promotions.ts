import {
  SortBy,
  FilterBy,
  Category,
  CuisineType,
  DaysOfWeek,
  DiscountType,
  ServiceOptions,
  Sort,
} from "../types/promotion";
import { Promotion } from "../types/promotion";
import { Restaurant } from "../types/restaurant";
import { enumContainsValue } from "../utils/enum";

export async function get(): Promise<Promotion[]> {
  return fetch("/promotions")
    .then((res: Response) => res.json())
    .catch(() => []);
}

export async function getRestaurant({
  placeId,
}: Promotion): Promise<Restaurant> {
  // TODO: find restaurant given placeId from promotion
  return {
    id: placeId,
    address: "1850 W 4th Ave, Vancouver, BC V6J 1M3",
    cuisineType: "Italian",
    distance: 500,
    name: "Trattoria",
    phoneNumber: "604-732-1441",
    photos: [],
    price: "$$",
    rating: 4.1,
    reviews: "https://google.com",
    website: "https://www.glowbalgroup.com/trattoria/trattoria-burnaby.html",
    hours: {
      sunday: "10:30 AM - Late",
      monday: "11:30 AM - Late",
      tuesday: "11:30 AM - Late",
      wednesday: "11:30 AM - Late",
      thursday: "11:30 AM - Late",
      friday: "11:30 AM - Late",
      saturday: "10:30 AM - Late",
    },
  };
}

export function sortPromotions(
  promotions: Promotion[],
  sort: SortBy
): Promotion[] {
  switch (sort) {
    case Sort.Distance:
      return sortDistance(promotions);
    case Sort.MostPopular:
      return sortPopularity(promotions);
    case Sort.Rating:
      return sortRating(promotions);
    default:
      return promotions;
  }
}

function sortDistance(promotions: Promotion[]) {
  // TODO: sort based on restaurant distance
  return promotions;
}

function sortPopularity(promotions: Promotion[]) {
  // TODO: sort based on number of saves
  return promotions;
}

function sortRating(promotions: Promotion[]) {
  // TODO: sort based on number of ratings
  return promotions;
}

export function filterPromotions(
  promotions: Promotion[],
  filter: FilterBy
): Promotion[] {
  if (enumContainsValue(Category, filter)) {
    return filterCategory(promotions, filter as Category);
  } else if (enumContainsValue(CuisineType, filter)) {
    return filterCuisineType(promotions, filter as CuisineType);
  } else if (enumContainsValue(DaysOfWeek, filter)) {
    return filterDaysOfWeek(promotions, filter as DaysOfWeek);
  } else if (enumContainsValue(DiscountType, filter)) {
    return filterDiscountType(promotions, filter as DiscountType);
  } else if (enumContainsValue(ServiceOptions, filter)) {
    return filterServiceOptions(promotions, filter as ServiceOptions);
  }
  return promotions;
}

function filterCategory(promotions: Promotion[], filter: Category) {
  return promotions.filter(
    ({ category }) => category.replace("\\s", "_").toUpperCase() === filter
  );
}

function filterCuisineType(promotions: Promotion[], filter: CuisineType) {
  return promotions.filter(
    ({ cuisine }) => cuisine.replace("\\s", "_").toUpperCase() === filter
  );
}

function filterDaysOfWeek(promotions: Promotion[], filter: DaysOfWeek) {
  // TODO: filter based on promotion schedule
  return promotions;
}

function filterDiscountType(promotions: Promotion[], filter: DiscountType) {
  switch (filter) {
    case DiscountType.DollarsOff:
      return promotions.filter(({ discount }) => discount.type === "$");
    case DiscountType.PercentOff:
      return promotions.filter(({ discount }) => discount.type === "%");
  }
}

function filterServiceOptions(promotions: Promotion[], filter: ServiceOptions) {
  // TODO: filter based on restaurant's service options
  return promotions;
}
