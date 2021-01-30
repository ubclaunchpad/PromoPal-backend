import { User } from '../../main/entity/User';
import { randomString } from '../utility/Utility';

export class UserFactory {
  generate(
    firstName?: string,
    lastName?: string,
    email?: string,
    username?: string,
    password?: string
  ): User {
    return new User(
      firstName ?? randomString(10),
      lastName ?? randomString(10),
      email ?? randomString(10) + '@gmail.com',
      username ?? randomString(10),
      password ?? randomString(10)
    );
  }
}
