/**
 * Fetches the enumeration at the given endpoint.
 *
 * Example usage:
 * ```
 * import Routes from "<path-to>/utils/routes";
 * getEnum(Routes.ENUMS.CUISINE_TYPES);
 * ```
 */
export async function getEnum(endpoint: string): Promise<string[]> {
  return fetch(endpoint)
    .then((res: Response) => res.json())
    .catch(() => []);
}
