import { Restaurant } from '../../main/entity/Restaurant';
import {
  randomLatitude,
  randomLongitude,
  randomString,
} from '../utility/Utility';

export class RestaurantFactory {
  generate(placeId?: string, lat?: number, lon?: number): Restaurant {
    return new Restaurant(
      placeId ?? randomString(10),
      lat ?? randomLatitude(),
      lon ?? randomLongitude()
    );
  }
}
