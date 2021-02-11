import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './User';
import { Discount } from './Discount';
import { PromotionType } from '../data/PromotionType';
import { CuisineType } from '../data/CuisineType';
import { SavedPromotion } from './SavedPromotion';
import { Schedule } from './Schedule';

/*
 * Represents a promotion
 * * A promotion is created by one user and can have many discounts
 * */
@Entity()
export class Promotion {
  constructor(
    user: User,
    discount: Discount,
    schedules: Schedule[],
    placeId: string,
    promotionType: PromotionType,
    cuisine: CuisineType,
    name: string,
    description: string,
    startDate: Date,
    expirationDate: Date,
    restaurantName: string,
    restaurantLocation: string
  ) {
    this.user = user;
    this.discount = discount;
    this.schedules = schedules;
    this.placeId = placeId;
    this.promotionType = promotionType;
    this.cuisine = cuisine;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.expirationDate = expirationDate;
    this.restaurantName = restaurantName;
    this.restaurantLocation = restaurantLocation;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  /*
   * Represents Google Places API place_id
   * Many promotions can come from the same restaurant and thus have the same placeId
   * */
  @Column()
  placeId: string;

  /*
   * ManyToOne bidirectional relationship between Promotion and User
   * Many promotions can be owned/uploaded by one user
   * On delete cascade on foreign key userId
   * Promotion is the owning side of this association, contains column userId
   * */
  @ManyToOne(() => User, (user) => user.uploadedPromotions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  /*
   * OneToOne bidirectional relationship between Promotion and Discount
   * Each promotion can have a single discount
   * */
  @OneToOne(() => Discount, (discount) => discount.promotion, {
    cascade: true,
    nullable: false,
  })
  discount: Discount;

  /*
   * ManyToMany bidirectional relationship between Promotion and User
   * SavedPromotion is the join table with custom properties
   * Each promotion can be saved by 0 or many users
   * Not included in constructor b/c when we create a promotion, there are no users who have saved it yet
   * */
  @OneToMany(
    () => SavedPromotion,
    (savedPromotion) => savedPromotion.promotion,
    {}
  )
  savedBy: SavedPromotion[];

  /*
   * OneToMany bidirectional relationship between Promotion and Schedule
   * Each promotion can have 0 or more schedules
   * */
  @OneToMany(() => Schedule, (schedule) => schedule.promotion, {
    nullable: false,
    cascade: true,
  })
  schedules: Schedule[];

  @Column({
    type: 'enum',
    enum: PromotionType,
    default: PromotionType.OTHER,
  })
  promotionType: PromotionType;

  @Column({
    type: 'enum',
    enum: CuisineType,
    default: CuisineType.OTHER,
  })
  cuisine: CuisineType;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({
    name: 'date_added',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP', // https://github.com/typeorm/typeorm/issues/877
  })
  dateAdded: Date;

  /**
   * Represents when a promotion starts.
   * Note: See PromotionDTO.startDate for more details
   * */
  @Column({
    name: 'start_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({
    name: 'expiration_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expirationDate: Date;

  /**
   * Represents a Postgres tsvector used for Full Text Search. Elements of a tsvector are lexemes along with their positions
   * * Not to be included in constructor since there is a trigger that sets this column automatically on update/insert
   * * select: false since this information should be hidden from client
   * */
  @Column({
    name: 'tsvector',
    type: 'tsvector',
    nullable: false,
    select: false,
  })
  tsVector: string;

  /*
   * Represents restaurant name from Google Places API
   * Many promotions can come from the same restaurant and thus have the same restaurantName
   * */
  @Column()
  restaurantName: string;

  /*
   * Represents restaurant location from Google Places API
   * Many promotions can come from the same restaurant and thus have the same restaurantLocation
   * */
  @Column()
  restaurantLocation: string;

  /*
   * These are just temporary values due to caching restrictions for lat/lon
   */
  lon?: number;
  lat?: number;

  /**
   * Not included in the constructor because when we create a promotion, starts at 0 votes
   * Only way to "interact" with votes is through direct endpoints that increase/decrease the votes
   * */
  @Column({
    type: 'integer',
    default: 0,
  })
  votes: number;
}
