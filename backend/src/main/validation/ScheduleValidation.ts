import Joi from 'joi';
import { Day } from '../data/Day';

export const END_TIME_FORMAT = 'Invalid 24 hour format for end time';
export const START_TIME_FORMAT = 'Invalid 24 hour format for start time';

/**
 * Used for validation of 24 hour format
 * */
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Custom error messages for start and end time
 * */
const startTimeMessages = {
  'string.pattern.base': START_TIME_FORMAT,
};

const endTimeMessages = {
  'string.pattern.base': END_TIME_FORMAT,
};

/**
 * Validator to ensure that start time is less than end time
 * * If start time is >= than end time, then return error code `invalidTime`, which will return corresponding message TIME_COMPARISON
 * */
const customTimeValidator = (startTime: any, helpers: any) => {
  const endTime = helpers?.state?.ancestors[0]?.endTime;
  const startMinutes = getMinutes(startTime);
  const endMinutes = getMinutes(endTime);

  // validate start and end time ONLY if they can be successfully converted to numbers
  if (startMinutes && endMinutes && startMinutes >= endMinutes) {
    // this will return with code = 'custom' and the respective message
    return helpers.message(
      `Start time '${startTime}' must be less than end time '${endTime}'`
    );
  }
  return startTime;
};

/**
 * Converts 24 hour time format to minutes
 * * Does not factor in seconds
 * * Return null if any exception thrown, this must mean that time is not properly formatted or could be incorrect type
 * */
function getMinutes(time: string): number | null {
  try {
    const timeParts: string[] = time.split(':');
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Checks the validity of a Schedule
 * */
export class ScheduleValidation {
  // note: since schema is marked as required, this means PromotionValidation's schedules must contain at least one schedule
  static schema = Joi.object({
    startTime: Joi.string()
      .regex(timeRegex)
      .messages(startTimeMessages)
      .required()
      .custom(customTimeValidator), // only use time validator for startTime so we do not get duplicate start/end time error messages
    endTime: Joi.string().regex(timeRegex).messages(endTimeMessages).required(),
    isRecurring: Joi.boolean().required(),
    dayOfWeek: Joi.string()
      .valid(...Object.values(Day))
      .required(),
  }).required();
}

export interface ScheduleDTO {
  startTime: string;
  endTime: string;
  dayOfWeek: Day;
  isRecurring: boolean;
}
