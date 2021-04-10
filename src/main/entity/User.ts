import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Promotion } from './Promotion';
import { SavedPromotion } from './SavedPromotion';
import { VoteRecord } from './VoteRecord';

/*
 * Represents a user in our application.
 * * Each user can upload/save many promotions
 * */
@Entity('user_profile')
export class User {
  constructor(firstName: string, lastName: string, username: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
  }

  /**
   * We are synchronizing the id in our database with the uid in firebase. Therefore, any userId in our database should
   * have a respective account in firebase with the same id
   * */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /*
   * OneToMany bidirectional relationship between User and Promotion
   * Each user can upload 0 or more promotions.
   * */
  @OneToMany(() => Promotion, (promotion) => promotion.user, {
    cascade: true,
  })
  uploadedPromotions: Promotion[];

  /*
   * ManyToMany bidirectional relationship between User and Promotion
   * SavedPromotion is the join table with custom properties
   * Each user can save 0 or more promotions
   * */
  @OneToMany(() => SavedPromotion, (savedPromotion) => savedPromotion.user, {
    cascade: true,
  })
  savedPromotions: SavedPromotion[];

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    unique: true,
  })
  username: string;

  @OneToMany(() => VoteRecord, (voteRecord) => voteRecord.user, {
    cascade: true,
  })
  votedRecord: VoteRecord[];
}
