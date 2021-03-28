export function randomString(length: number): string {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function getRandomInRange(from: number, to: number, decimals: number): number {
  return Number.parseFloat(
    (Math.random() * (to - from) + from).toFixed(decimals)
  );
}

export const randomLatitude = (): number => getRandomInRange(-90, 90, 3);
export const randomLongitude = (): number => getRandomInRange(-180, 180, 3);
