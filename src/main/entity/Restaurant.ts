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
  constructor(name: string, address: string, lat: number, lon: number) {
    this.name = name;
    this.address = address;
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

  /*
   * The restaurant name
   * Many promotions can come from the same restaurant and thus have the same restaurant name
   * */
  @Column()
  name: string;

  /*
   * The restaurant address
   * Many promotions can come from the same restaurant and thus have the same address
   * */
  @Column()
  address: string;

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
