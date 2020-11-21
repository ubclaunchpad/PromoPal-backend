import { getConnection, getCustomRepository } from 'typeorm';
import { schedules_sample } from '../../main/resources/Data';
import { BaseRepositoryTest } from './BaseRepositoryTest';
import { ScheduleRepository } from '../../main/repository/ScheduleRepository';
import { Schedule } from '../../main/entity/Schedule';

describe('Unit tests for DiscountRepository', function () {
  let scheduleRepository: ScheduleRepository;
  beforeEach(() => {
    return BaseRepositoryTest.establishTestConnection().then(() => {
      scheduleRepository = getCustomRepository(ScheduleRepository);
    });
  });

  afterEach(() => {
    const conn = getConnection();
    return conn.close();
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
