import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Promotion } from './Promotion';

/*
 * Represents a promotion's restaurant.
 * */
@Entity()
export class Restaurant {
  constructor(placeId: string, lat: number, lon: number) {
    this.placeId = placeId;
    this.lat = lat;
    this.lon = lon;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  /*
   * OneToMany bidirectional relationship between Restaurant and Promotion
   * Bidirectional for search query purposes (find promotions related to a restaurant)
   * Each restaurant can be associated with multiple promotions
   * */
  @OneToMany(() => Promotion, (promotion) => promotion.restaurant)
  promotion: Promotion;

  /*
   * Represents Google Places API place_id
   * Many promotions can come from the same restaurant and thus have the same placeId
   * */
  @Column()
  placeId: string;

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
