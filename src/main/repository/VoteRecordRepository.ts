import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Promotion } from '../entity/Promotion';
import { VoteRecord } from '../entity/VoteRecord';

@EntityRepository(VoteRecord)
export class VoteRecordRepository extends Repository<VoteRecord> {
  addVoteRecord(user: User, promotion: Promotion): Promise<VoteRecord> {
    return this.save(new VoteRecord(user, promotion));
  }
}
