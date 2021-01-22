import { FilterOptions, Promotion, Sort } from "../types/promotion";
import Routes from "../utils/routes";

/**
 * Fetches entire list of promotions. If a query object is given, filters the promotions according to the given query.
 * If an error occurs, an empty list will be returned.
 */
export async function getPromotions(query?: Record<string, string>): Promise<Promotion[]> {
  let endpoint = Routes.PROMOTIONS;
  if (query) {
    const queryParams = new URLSearchParams(query);
    endpoint += `?${queryParams.toString()}`;
  }
  return fetch(endpoint)
    .then((res: Response) => res.json())
    .catch(() => []);
}

/**
 * Returns the subset of all promotions which satisfy at least one filter key in the `filters` parameter.
 *
 * @param filters - An object specifying the keys and the values to filter the promotions by
 */
export function filterPromotions(filters: FilterOptions): Promise<Promotion[]> {
  const { cuisine, dayOfWeek, discountType, promotionType } = filters;

  const promotionQueryDTO: Record<string, string> = {};
  if (cuisine?.length > 0) {
    promotionQueryDTO.cuisine = cuisine;
  }
  if (discountType?.length > 0) {
    // Handle case where filter is one of ["$ Off", "% Off"]
    let discount = discountType;
    if (discountType !== "Other") {
      discount = discountType.substring(0, 1);
    }
    promotionQueryDTO.discountType = discount;
  }
  if (promotionType?.length > 0) {
    // Stringify array of promotion types
    promotionQueryDTO.promotionType = JSON.stringify(promotionType);
  }

  return getPromotions(promotionQueryDTO);
}

/**
 * Sorts the given of list of promotions by the given key.
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
