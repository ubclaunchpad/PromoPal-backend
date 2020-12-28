import { Day } from '../../main/data/Day';
import { Schedule } from '../../main/entity/Schedule';

export class ScheduleFactory {
  generate(
    startTime?: string,
    endTime?: string,
    dayOfWeek?: Day,
    isRecurring?: boolean
  ) {
    return new Schedule(
      startTime ?? '10:00',
      endTime ?? '23:59',
      dayOfWeek ?? Day.THURSDAY,
      isRecurring ?? false
    );
  }
}
