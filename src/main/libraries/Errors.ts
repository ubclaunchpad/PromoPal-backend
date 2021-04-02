import { ForbiddenError } from '../errors/Error';

export default class Errors {
  public static INSUFFICIENT_PRIVILEGES(errorMessage?: string): ForbiddenError {
    errorMessage =
      errorMessage ||
      'Your account does not have sufficient privileges to perform this action.';
    return new ForbiddenError(errorMessage);
  }
}
