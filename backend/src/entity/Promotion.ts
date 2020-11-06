import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn
} from "typeorm";
import {User} from "./User";
import {Discount} from "./Discount";
import {PromotionCategory} from "../data/PromotionCategory";
import {CuisineType} from "../data/CuisineType";
import {SavedPromotion} from "./SavedPromotion";

/*
* Represents a promotion
* * A promotion is created by one user and can have many discounts
* */
@Entity()
export class Promotion {
    constructor(user: User, discounts: Discount[], category: PromotionCategory, cuisine: CuisineType, name: string, description: string, expirationDate: Date, priceRange: string) {
        this.user = user;
        this.discounts = discounts;
        this.category = category;
        this.cuisine = cuisine;
        this.name = name;
        this.description = description;
        this.expirationDate = expirationDate;
        this.priceRange = priceRange;
    }

    @PrimaryGeneratedColumn("uuid")
    id: number;

    /*
    * ManyToOne bidirectional relationship between Promotion and User
    * Many promotions can be owned/uploaded by one user
    * On delete cascade on foreign key userId
    * Promotion is the owning side of this association, contains column userId
    * */
    @ManyToOne(() => User, user => user.uploadedPromotions, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn()
    user: User;

    /*
    * OneToMany bidirectional relationship between Promotion and Discount
    * Each promotion can have many discounts
    * */
    @OneToMany(() => Discount, discount => discount.promotion, {
        cascade: true,
        nullable: false,
    })
    discounts: Discount[]

    /*
    * ManyToMany bidirectional relationship between Promotion and User
    * SavedPromotion is the join table with custom properties
    * Each promotion can be saved by 0 or many users
    * */
    @OneToMany(() => SavedPromotion, savedPromotion => savedPromotion.promotion, {})
    savedBy: SavedPromotion[]

    @Column({
        type: "enum",
        enum: PromotionCategory,
        default: PromotionCategory.OTHER
    })
    category: PromotionCategory;

    @Column({
        type: "enum",
        enum: CuisineType,
        default: CuisineType.OTHER
    })
    cuisine: CuisineType;

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn({
        name: 'date_added',
        type: "timestamptz",
        default: () => "CURRENT_TIMESTAMP" // https://github.com/typeorm/typeorm/issues/877
    })
    dateAdded: Date;

    @Column({
        name: 'expiration_date',
        type: "timestamptz",
        default: () => "CURRENT_TIMESTAMP"
    })
    expirationDate: Date;

    @Column({
        name: 'price_range'
    })
    priceRange: string

}
