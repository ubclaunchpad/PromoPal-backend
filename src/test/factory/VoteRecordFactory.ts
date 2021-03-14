import { User } from '../../main/entity/User';
import { Promotion } from '../../main/entity/Promotion';
import { VoteRecord } from '../../main/entity/VoteRecord';

export class VoteRecordFactory {
  generate(user: User, promotion: Promotion): VoteRecord {
    return new VoteRecord(user, promotion);
  }
}
