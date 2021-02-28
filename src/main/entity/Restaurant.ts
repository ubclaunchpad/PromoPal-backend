import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Promotion } from './Promotion';

/*
 * Represents a promotion's restaurant.
 * */
@Entity()
export class Restaurant {
  constructor(lat: number, lon: number) {
    this.lat = lat;
    this.lon = lon;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  /*
   * OneToOne bidirectional relationship between Restaurant and Promotion
   * On delete cascade on foreign key promotionId
   * Bidirectional for search query purposes (find promotions related to a restaurant)
   * */
  @OneToOne(() => Promotion, (promotion) => promotion.restaurant, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  promotion: Promotion;

  /**
   * Latitude coordinates of restaurant
   * */
  @Column('real')
  lat: number;

  /**
   * Longitude coordinates of restaurant
   * */
  @Column('real')
  lon: number;
}
