CREATE TABLE User (
    user_id INTEGER NOT NULL, 
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    email VARCHAR(30),
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE Restaurant (
    restaurant_id INTEGER NOT NULL,
    name VARCHAR(20),
    address VARCHAR(30),
    PRIMARY KEY(restaurant_id)
);

CREATE TABLE Discount (
    discount_id INTEGER,
    discount_type VARCHAR(20),
    discount_value INTEGER,
    PRIMARY KEY(discount_id)
);

CREATE TABLE Promotion (
    promotion_id INTEGER NOT NULL,
    restaurant_id INTEGER,
    discount INTEGER,
    name VARCHAR(30),
    description VARCHAR(50),
    date_added timestamp with time zone,
    end_date DATE,
    price_range VARCHAR(20),
    PRIMARY KEY(promotion_id),
    FOREIGN KEY (restaurant_id) references Restaurant(restaurant_id)
        on delete cascade
        on update cascade,
    FOREIGN KEY (discount) references Discount(discount_id)
        on delete cascade
        on update cascade
);