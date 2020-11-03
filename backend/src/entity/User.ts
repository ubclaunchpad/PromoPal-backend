import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm";
import {Promotion} from "./Promotion";

/*
* Represents a user in our application.
* * Each user can upload/save many promotions
* */
@Entity()
export class User {
    constructor(firstName: string, lastName: string, email: string, username: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    @PrimaryGeneratedColumn("uuid")
    id: number;

    /*
    * OneToMany relationship between User and Promotion
    * Each user can upload 0 or more promotions.
    * */
    @OneToMany(() => Promotion, promotion => promotion.user, {
        cascade: true,
    })
    uploadedPromotions: Promotion[]

    /*
    * ManyToMany relationship between User and Promotion
    * Each user can save 0 or more promotions
    * User is the owning side of the relationship, connected through join table
    * */
    @ManyToMany(() => Promotion, {
        cascade: true,
    })
    @JoinTable({name: "saved_promotions"})
    savedPromotions: Promotion[]

    @Column({
        name: 'first_name'
    })
    firstName: string;

    @Column({
        name: 'last_name'
    })
    lastName: string;

    @Column({
        unique: true
    })
    email: string;

    @Column({
        unique: true
    })
    username: string;

    // todo: we need something more secure
    @Column({
        unique: true
    })
    password: string

}
