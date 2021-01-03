import Routes from "../utils/routes";

/**
 * Fetches discount type enumeration to be used for filter dropdown options.
 */
export async function getDiscountTypes(): Promise<string[]> {
  return fetch(Routes.ENUMS.DISCOUNT_TYPES)
    .then((res: Response) => res.json())
    .catch(() => []);
}
