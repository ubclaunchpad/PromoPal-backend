type EnumSuccess = string[];

type EnumError = {
  errorCode: string;
  message: string[];
};

type EnumResponse = EnumSuccess | EnumError;

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
    .then((enumeration: EnumResponse) => {
      // Enumerations are returned as arrays
      if (Array.isArray(enumeration)) {
        return enumeration as EnumSuccess;
      }
      // If it isn't an array, it's probably an object that indicates an error
      throw enumeration as EnumError;
    })
    .catch((err: Error) => {
      // Allow caller to handle error
      throw err;
    });
}
