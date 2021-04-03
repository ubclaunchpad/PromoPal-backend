import { NextFunction, Request, Response } from 'express';
import { FrontEndErrorObject } from '../data/FrontEndErrorObject';
import { ValidationError } from 'joi';
import { BaseError } from '../errors/Error';

/**
 * Middleware function to catch all global errors and convert them into FrontEndErrorObjects
 * */
/* eslint-disable  @typescript-eslint/no-unused-vars */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  // todo: see if can figure out the extension functions
  if (error instanceof ValidationError)
    return res.status(400).send(
      new FrontEndErrorObject(
        error.name,
        error.details.map((detail) => detail.message)
      )
    );

  if (error instanceof BaseError)
    return res
      .status(error.status)
      .send(new FrontEndErrorObject(error.name, [error.message]));

  return res
    .status(500)
    .send(new FrontEndErrorObject(error.name, [error.message]));
}
