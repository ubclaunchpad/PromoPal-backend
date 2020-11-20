import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { Promotion } from './Promotion';

/*
 * Represents a user who saved a promotion
 * * the join/association table which connects User and Promotion
 * * contains custom properties
 * */
@Entity()
export class SavedPromotion {
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

  @CreateDateColumn({
    name: 'date_saved',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateSaved: Date;

  @ManyToOne(() => User, (user) => user.savedPromotions, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Promotion, (promotion) => promotion.savedBy, {
    onDelete: 'CASCADE',
  })
  promotion: Promotion;
}
