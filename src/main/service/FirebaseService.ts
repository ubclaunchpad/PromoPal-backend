import { auth } from 'firebase-admin/lib/auth';
import Auth = auth.Auth;

/**
 * Service class for operations related to firebase
 */
export class FirebaseService {
  private admin: Auth;

  constructor(firebaseAdmin: Auth) {
    this.admin = firebaseAdmin;
  }

  /**
   * Create a user in firebase
   * @param uid the id of the user
   * @param email the email of the user
   * @param password the password of the user
   * */
  createUserFromEmailAndPassword(
    uid: string,
    email: string,
    password: string
  ): Promise<auth.UserRecord> {
    return this.admin.createUser({
      uid,
      email,
      password,
    });
  }
}
