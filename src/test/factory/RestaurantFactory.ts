import { Restaurant } from '../../main/entity/Restaurant';
import {
  randomLatitude,
  randomLongitude,
  randomString,
} from '../utility/Utility';

export class RestaurantFactory {
  generate(
    name?: string,
    address?: string,
    lat?: number,
    lon?: number
  ): Restaurant {
    return new Restaurant(
      name ?? randomString(100),
      address ?? randomString(100),
      lat ?? randomLatitude(),
      lon ?? randomLongitude()
    );
  }
}
