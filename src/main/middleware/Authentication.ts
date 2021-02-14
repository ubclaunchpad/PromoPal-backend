import { NextFunction } from 'express';
import { firebaseAdmin } from '../service/FirebaseConfig';
import { Request, Response } from 'express';

/**
 * Middleware function to check if the request has correct client header using fireabse-admin auth
 */
export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const idToken: string = req.headers.authorization!;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    if (decodedToken) {
      req.body.uid = decodedToken.uid;
      return next();
    } else {
      return res.status(401).send('You are not authorized');
    }
  } catch (e) {
    return res.status(401).send('You are not authorized!');
  }
};