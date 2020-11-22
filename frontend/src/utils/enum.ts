export function enumContainsValue<T>(enumeration: T, str: string): boolean {
  return Object.values(enumeration).some((value) => value === str);
}
