import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { auth } from 'firebase-admin/lib/auth';
import Auth = auth.Auth;

/**
 * Middleware function to check if the request has correct client header using firebase-admin auth
 */
export class FirebaseAuthMiddleware {
  private admin: Auth;

  constructor(firebaseAdmin: Auth) {
    this.admin = firebaseAdmin;
  }

  // see if the idToken in request header is valid. Decode the idToken then return next instruction if there
  // exists decodedToken
  isAuthorizedForProtection = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const idToken: string = req.headers.authorization!;

    try {
      const decodedToken = await this.admin.verifyIdToken(idToken);

      if (decodedToken) {
        res.locals.firebaseUserId = decodedToken.uid;
        return next();
      } else {
        return res.status(401).send('You are not authorized');
      }
    } catch (e) {
      return res.status(401).send('You are not authorized!');
    }
  };
}
