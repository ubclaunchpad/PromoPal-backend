/**
 * Represents an error object for responses to the front end
 * * errorCode - a user friendly error name (e.g. UnexpectedError, InvalidInputError)
 * * message - any details for the front end encapsulated in an array of strings
 * */
export class FrontEndErrorObject {
  errorCode: string;
  message: string[];

  constructor(errorCode: string, message: string[]) {
    this.errorCode = errorCode;
    this.message = message;
  }
}
