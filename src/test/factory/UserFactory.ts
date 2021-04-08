import { User } from '../../main/entity/User';
import { randomString } from '../utility/Utility';

export class UserFactory {
  generate(firstName?: string, lastName?: string, username?: string): User {
    return new User(
      firstName ?? randomString(10),
      lastName ?? randomString(10),
      username ?? randomString(10)
    );
  }
}
