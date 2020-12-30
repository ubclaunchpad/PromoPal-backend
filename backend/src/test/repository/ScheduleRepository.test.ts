import { getCustomRepository } from 'typeorm';
import connection from './BaseRepositoryTest';
import { ScheduleRepository } from '../../main/repository/ScheduleRepository';
import { Schedule } from '../../main/entity/Schedule';
import { ScheduleFactory } from '../factory/ScheduleFactory';

describe('Unit tests for DiscountRepository', function () {
  let scheduleRepository: ScheduleRepository;
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
    scheduleRepository = getCustomRepository(ScheduleRepository);
  });

  test('Should not be able to save schedule without promotion', async () => {
    const schedule: Schedule = new ScheduleFactory().generate();
    try {
      await scheduleRepository.save(schedule);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toContain('violates not-null constraint');
    }
  });
});
