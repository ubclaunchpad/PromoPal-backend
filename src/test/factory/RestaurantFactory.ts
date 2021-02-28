import { Restaurant } from '../../main/entity/Restaurant';
import { randomLatitude, randomLongitude } from '../utility/Utility';

export class RestaurantFactory {
  generate(lat?: number, lon?: number): Restaurant {
    return new Restaurant(lat ?? randomLatitude(), lon ?? randomLongitude());
  }
}
