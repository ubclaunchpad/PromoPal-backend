import { EntityRepository, Repository } from 'typeorm';
import { Promotion } from '../entity/Promotion';

@EntityRepository(Promotion)
export class PromotionRepository extends Repository<Promotion> {}
