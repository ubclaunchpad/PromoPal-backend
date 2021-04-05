import { ErrorMessages } from './ErrorMessages';

class BaseError extends Error {
  public name: string;
  public status: number;

  constructor(errorName: string, errorMessage: string, status: number) {
    super(errorMessage);
    this.name = errorName;
    this.status = status;
  }
}

class ForbiddenError extends BaseError {
  constructor(errorMessage?: string) {
    super(
      'ForbiddenError',
      errorMessage ?? ErrorMessages.INSUFFICIENT_PRIVILEGES,
      403
    );
  }
}

export { BaseError, ForbiddenError };
