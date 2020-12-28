import {
  END_TIME_FORMAT,
  ScheduleValidation,
  START_TIME_FORMAT,
} from '../../main/validation/ScheduleValidation';
import { Day } from '../../main/data/Day';

describe('Unit tests for ScheduleValidation', function () {
  // mark these types as any so that we can make them improper
  let scheduleDTO: any;

  beforeEach(() => {
    scheduleDTO = {
      startTime: '08:00',
      endTime: '10:00',
      dayOfWeek: Day.THURSDAY,
      isRecurring: false,
    };
  });

  test('Should return no errors for a valid schedule', async () => {
    try {
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await ScheduleValidation.schema.validateAsync(undefined, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" is required');
    }
  });

  test('Should fail if a schedule is not a day of the week', async () => {
    try {
      scheduleDTO.dayOfWeek = null;
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        '"dayOfWeek" must be one of [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]'
      );
      expect(e.details[1].message).toEqual('"dayOfWeek" must be a string');
    }
  });

  test('Should pass for valid start time', async () => {
    const times = [
      '01:00',
      '02:15',
      '03:59',
      '04:47',
      '11:59',
      '19:59',
      '20:01',
      '23:58',
    ];

    scheduleDTO.endTime = '23:59';
    for (const time of times) {
      try {
        scheduleDTO.startTime = time;
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
      } catch (e) {
        fail('Should not have failed');
      }
    }
  });

  test('Should pass for valid end time', async () => {
    const times = [
      '1:00',
      '2:15',
      '3:59',
      '04:47',
      '11:59',
      '19:59',
      '20:01',
      '23:59',
    ];

    scheduleDTO.startTime = '00:00';
    for (const time of times) {
      try {
        scheduleDTO.endTime = time;
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
      } catch (e) {
        fail('Should not have failed');
      }
    }
  });

  test('Should fail for any invalid start time', async () => {
    const times = ['1:60', '31:15', '24:01', '1:6'];

    scheduleDTO.endTime = '60:00'; // don't want start time to be >= end time
    for (const time of times) {
      try {
        scheduleDTO.startTime = time;
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
        fail('Should have failed');
      } catch (e) {
        expect(e.details.length).toEqual(2);
        expect(e.details[0].message).toEqual(START_TIME_FORMAT);
        expect(e.details[1].message).toEqual(END_TIME_FORMAT);
      }
    }
  });

  test('Should fail for any invalid end time', async () => {
    const times = ['1:60', '31:15', '24:01', '1:6'];

    scheduleDTO.startTime = '0:00'; // don't want start time to be >= end time
    for (const time of times) {
      try {
        scheduleDTO.endTime = time;
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
        fail('Should have failed');
      } catch (e) {
        expect(e.details.length).toEqual(1);
        expect(e.details[0].message).toEqual(END_TIME_FORMAT);
      }
    }
  });

  test('Start time cannot be greater than end time', async () => {
    const startTimeEndTimePairs = [
      ['9:00', '8:00'],
      ['9:01', '9:00'],
      ['12:00', '11:59'],
    ];

    for (const startEndTimePair of startTimeEndTimePairs) {
      try {
        scheduleDTO.startTime = startEndTimePair[0];
        scheduleDTO.endTime = startEndTimePair[1];
        await ScheduleValidation.schema.validateAsync(scheduleDTO, {
          abortEarly: false,
        });
        fail('Should have failed');
      } catch (e) {
        expect(e.details.length).toEqual(1);
        expect(e.details[0].message).toEqual(
          `Start time '${scheduleDTO.startTime}' must be less than end time '${scheduleDTO.endTime}'`
        );
      }
    }
  });

  test('When time format is not the same, but is still valid should not fail', async () => {
    try {
      scheduleDTO.startTime = '08:00';
      scheduleDTO.endTime = '9:00';
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed');
    }
  });

  test('When start time is valid, but end time is a different type, should not compare start and end time', async () => {
    try {
      scheduleDTO.startTime = '08:00';
      scheduleDTO.endTime = 8;
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"endTime" must be a string');
    }
  });

  test('When end time is valid, but start time is a different type, should not compare start and end time', async () => {
    try {
      scheduleDTO.startTime = false;
      scheduleDTO.endTime = '1:00';
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"startTime" must be a string');
    }
  });

  test('If start time greater than end time and end time invalid format, show both errors', async () => {
    try {
      scheduleDTO.startTime = '8:00';
      scheduleDTO.endTime = '1:72';
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(2);
      expect(e.details[0].message).toEqual(
        'Start time \'8:00\' must be less than end time \'1:72\''
      );
      expect(e.details[1].message).toEqual(
        'Invalid 24 hour format for end time'
      );
    }
  });

  test('Should fail if incorrect types', async () => {
    try {
      scheduleDTO = {
        startTime: '138:00',
        endTime: -1,
        dayOfWeek: true,
        isRecurring: 'hello',
      };
      await ScheduleValidation.schema.validateAsync(scheduleDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(5);
      expect(e.details[0].message).toEqual(
        'Invalid 24 hour format for start time'
      );
      expect(e.details[1].message).toEqual('"endTime" must be a string');
      expect(e.details[2].message).toEqual('"isRecurring" must be a boolean');
      expect(e.details[3].message).toEqual(
        '"dayOfWeek" must be one of [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]'
      );
      expect(e.details[4].message).toEqual('"dayOfWeek" must be a string');
    }
  });
});
