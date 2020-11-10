import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Promotion } from './Promotion';
import { DiscountType } from '../data/DiscountType';

/*
 * Represents a discount to a promotion. Each discount has a DiscountType which determines the discountValue.
 * * Each discount is associated with one promotion
 * */
@Entity()
export class Discount {
  // don't want to create a promotion from a discount, only want to create discount if creating promotion
  constructor(type: DiscountType, discountValue: number) {
    this.type = type;
    this.discountValue = discountValue;
  }

  @PrimaryGeneratedColumn('uuid')
  id: number;

  /*
   * OneToOne bidirectional relationship between Discount and Promotion
   * Each discount is owned by one promotion
   * On delete cascade on foreign key promotionId
   * Bidirectional for search query purposes (find promotions related to a discount)
   * */
  @OneToOne(() => Promotion, (promotion) => promotion.discount, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  promotion: Promotion;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.OTHER,
  })
  type: DiscountType;

  @Column('real')
  discountValue: number;
}
