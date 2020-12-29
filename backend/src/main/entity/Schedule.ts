import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { Promotion } from './Promotion';
import { Day } from '../data/Day';

/*
 * Represents a schedule to a promotion
 * * Each schedule is associated with one promotion
 * */
@Entity()
@Unique(['promotion', 'dayOfWeek']) // https://typeorm.io/#/decorator-reference/unique
export class Schedule {
  constructor(
    startTime: string,
    endTime: string,
    dayOfWeek: Day,
    isRecurring: boolean
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.dayOfWeek = dayOfWeek;
    this.isRecurring = isRecurring;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  /**
   * Represents 24 hour time format (hh:mm:ss or hh:mm:ss).
   * Does not support timezones yet
   * */
  @Column({
    type: 'time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: string;

  @Column({
    type: 'time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  endTime: string;

  @Column({
    type: 'enum',
    enum: Day,
  })
  dayOfWeek: Day;

  @Column()
  isRecurring: boolean;
}
