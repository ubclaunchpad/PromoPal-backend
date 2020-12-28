import { getConnection, getCustomRepository } from 'typeorm';
import { schedules_sample } from '../../main/resources/Data';
import connection from './BaseRepositoryTest';
import { ScheduleRepository } from '../../main/repository/ScheduleRepository';
import { Schedule } from '../../main/entity/Schedule';

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
    const schedule: Schedule = schedules_sample[0];
    try {
      await scheduleRepository.save(schedule);
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toBe(
        'null value in column "promotionId" violates not-null constraint'
      );
    }
  });
});
