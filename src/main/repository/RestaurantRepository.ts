import { EntityRepository, Repository } from 'typeorm';
import { Restaurant } from '../entity/Restaurant';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {}
