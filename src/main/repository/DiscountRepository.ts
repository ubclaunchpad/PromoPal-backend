import { EntityRepository, Repository } from 'typeorm';
import { Discount } from '../entity/Discount';

@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {}
