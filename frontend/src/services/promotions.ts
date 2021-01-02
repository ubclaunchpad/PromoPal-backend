import {
  CuisineType,
  DiscountType,
  DayOfWeek,
  FilterOptions,
  Promotion,
  ServiceOptions,
  Sort,
} from "../types/promotion";

/**
 * Fetches list of promotions and sets them on this instance.
 * If an error occurs, an empty list will be set on this instance.
 */
export async function getPromotions(): Promise<Promotion[]> {
  return fetch("/promotions")
    .then((res: Response) => res.json())
    .then((promotions: Promotion[]) => promotions)
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
  const { cuisineType, dayOfWeek, discountType, serviceOptions } = filters;

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
  if (filters.serviceOptions.length > 0) {
    promotions = filterServiceOptions(promotions, serviceOptions);
  }
  return promotions;
}

function filterCuisineType(promotions: Promotion[], filters: CuisineType[]) {
  let result: Promotion[] = [];
  for (const key of filters) {
    const filtered = promotions.filter(({ cuisine }) => {
      const sanitized = cuisine.replace("\\s", "_");
      return sanitized.toUpperCase() === key.toUpperCase();
    });
    result = [...result, ...filtered];
  }
  return result;
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

function filterDiscountType(promotions: Promotion[], filters: DiscountType[]) {
  let result: Promotion[] = [];
  for (const key of filters) {
    const filtered = promotions.filter((promotion) => {
      const {
        discount: { discountType },
      } = promotion;
      return discountType === key.substring(0, 1);
    });
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
