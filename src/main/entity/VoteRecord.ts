import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

/* Represents the record of voting
 * * the join/association table which connects User and Promotion
 * * contains custom properties
 * */
export enum VoteState {
  INIT = 0,
  UP = 1,
  DOWN = -1,
}

@Entity()
export class VoteRecord {
  constructor(user: User, promotion: Promotion) {
    this.user = user;
    this.promotion = promotion;
  }

  @Index()
  @PrimaryColumn()
  userId: string;

  @Index()
  @PrimaryColumn()
  promotionId: string;

  @ManyToOne(() => User, (user) => user.votedRecord, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Promotion, (promotion) => promotion.votedBy, {
    onDelete: 'CASCADE',
  })
  promotion: Promotion;

  @Column({
    type: 'enum',
    enum: VoteState,
    default: VoteState.INIT,
  })
  voteState: number;
}
