import {
  DayOfWeek,
  FilterOptions,
  Promotion,
  ServiceOptions,
  Sort,
} from "../types/promotion";
import Routes from "../utils/routes";

/**
 * Fetches list of promotions and sets them on this instance.
 * If an error occurs, an empty list will be set on this instance.
 */
export async function getPromotions(): Promise<Promotion[]> {
  return fetch(Routes.PROMOTIONS)
    .then((res: Response) => res.json())
    .catch(() => []);
}

/**
 * Returns the subset of this instance's promotions which satisfy at least one filter key in the `options` parameter.
 *
 * @param arr - The list of promotions to filter through
 * @param filters - An object specifying the keys and the values to filter the promotions by
 */
export function filterPromotions(
  arr: Promotion[],
  filters: FilterOptions
): Promotion[] {
  const {
    cuisineType,
    dayOfWeek,
    discountType,
    promotionType,
    serviceOptions,
  } = filters;

  let promotions = [...arr];
  if (filters.cuisineType.length > 0) {
    promotions = filterCuisineType(promotions, cuisineType);
  }
  if (filters.dayOfWeek.length > 0) {
    promotions = filterDayOfWeek(promotions, dayOfWeek);
  }
  if (filters.discountType.length > 0) {
    promotions = filterDiscountType(promotions, discountType);
  }
  if (filters.promotionType.length > 0) {
    promotions = filterPromotionType(promotions, promotionType);
  }
  if (filters.serviceOptions.length > 0) {
    promotions = filterServiceOptions(promotions, serviceOptions);
  }
  return promotions;
}

function filterCuisineType(promotions: Promotion[], filter: string) {
  return promotions.filter(({ cuisine }) => {
    const sanitized = cuisine.replace("\\s", "_");
    return sanitized.toUpperCase() === filter.toUpperCase();
  });
}

function filterDayOfWeek(promotions: Promotion[], filters: DayOfWeek[]) {
  let result: Promotion[] = [];
  for (const key of filters) {
    const filtered = promotions.filter(({ schedules }) => {
      return schedules.find(({ dayOfWeek }) => dayOfWeek === key);
    });
    result = [...result, ...filtered];
  }
  return result;
}

function filterDiscountType(promotions: Promotion[], filter: string) {
  // Handle case where filter is one of ["$ Off", "$ Off"]
  if (filter !== "Other") {
    filter = filter.substring(0, 1);
  }
  return promotions.filter(
    ({ discount: { discountType } }) => filter === discountType
  );
}

function filterPromotionType(promotions: Promotion[], filters: string[]) {
  let result: Promotion[] = [];
  for (const key of filters) {
    const filtered = promotions.filter(
      ({ promotionType }) => promotionType === key
    );
    result = [...result, ...filtered];
  }
  return result;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/100
function filterServiceOptions(
  promotions: Promotion[],
  filters: ServiceOptions[]
) {
  return promotions;
}

/**
 * Sorts the list of promotions set on this instance by the given key.
 *
 * @param arr - The list of promotions to sort
 * @param key - The key which to sort the promotions by
 */
export function sortPromotions(arr: Promotion[], key: Sort): Promotion[] {
  let promotions = [...arr];
  switch (key) {
    case Sort.Distance:
      promotions = sortByDistance(promotions);
      break;
    case Sort.MostPopular:
      promotions = sortByPopularity(promotions);
      break;
    case Sort.Rating:
      promotions = sortByRating(promotions);
      break;
  }
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByDistance(promotions: Promotion[]) {
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByPopularity(promotions: Promotion[]) {
  return promotions;
}

// TODO: see https://github.com/ubclaunchpad/foodies/issues/99
function sortByRating(promotions: Promotion[]) {
  return promotions;
}
