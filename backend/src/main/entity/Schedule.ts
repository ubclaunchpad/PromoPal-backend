import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Promotion } from './Promotion';

/*
 * Represents a schedule to a promotion
 * * Each schedule is associated with one promotion
 * */
// todo: incomplete
@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  /*
   * ManyToOne bidirectional relationship between Schedule and Promotion
   * Each promotion schedule is owned by a promotion
   * On delete cascade on foreign key promotionId
   * Bidirectional for search query purposes (find promotions related to a schedule)
   * Schedule is the owning side of the association, contains columnd promotionId
   * */
  @ManyToOne(() => Promotion, (promotion) => promotion.schedules, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  promotion: Promotion;
}
