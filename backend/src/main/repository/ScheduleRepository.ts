import { EntityRepository, Repository } from 'typeorm';
import { Schedule } from '../entity/Schedule';

@EntityRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {}
