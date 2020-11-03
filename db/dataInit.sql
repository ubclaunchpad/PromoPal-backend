INSERT INTO users values
    (1, 'John', 'Smith', 'smith.j@sample.com', 'user1', 'smith1234'),
    (2, 'Asa', 'Edward', 'edward.a@sample.com', 'user2', 'edward0821'),
    (3, 'Harry', 'James', 'james.h@sample.com', 'user3', 'james3331'),
    (4, 'Timothy', 'Dodson', 'dodson.t@sample.com', 'user4', 'dodson3134'),
    (5, 'Yuri', 'Davis', 'davis.y@sample.com', 'user5', 'davis9876'),
    (6, 'Ethal', 'May', 'may.e@sample.com', 'user6', 'may5432'),
    (7, 'Ruby', 'Eleanor', 'eleanor.r@sample.com', 'user7', 'eleanor3452'),
    (8, 'Alice', 'Thomas', 'thomas.a@sample.com', 'user8', 'thomas9999'),
    (9, 'Nick', 'Williams', 'williams.n@sample.com', 'user9', 'williams5476');

INSERT INTO restaurant values
    (1, 'Denny''s', '1098 Davie St, Vancouver, BC'),
    (2, 'Miku Vancouver', '200 Granville St, Vancouver, BC'),
    (3, 'Original Joe''s Restaurant & Bar', '298 Robson St, Vancouver, BC'),
    (4, 'Nightingale', '1017 W Hastings St, Vancouver, BC'),
    (5, 'Chambar Restaurant', '568 Beatty St, Vancouver, BC'),
    (6, 'The Acorn Restaurant', '3995 Main St, Vancouver, BC');

INSERT INTO discount(discount_id, discount_type, discount_value) values
    (1, 'PERCENTAGE', 10),
    (2, 'AMOUNT', 2),
    (3, 'PERCENTAGE', 8),
    (4, 'OTHER', NULL),
    (5, 'PERCENTAGE', 5),
    (6, 'PERCENTAGE', 15),
    (7, 'PERCENTAGE', 20),
    (8, 'AMOUNT', 5),
    (9, 'AMOUNT', 10);

INSERT INTO promotion(promotion_id, restaurant_id, discount, name, description, date_added, end_date, price_range) values
    (1, 1, 1, 'Halloween Discount', 'Every Items in denny''s is 10% off', '2020-10-15 10:20:00', '2020-10-31', NULL),
    (2, 5, 9, 'Discount for more than $30', 'A customers who pay more than $30 can get $10 discount', '2020-10-20 22:10:00', '2020-11-30', '$30~'),
    (3, 2, 4, 'Happy Hour', 'Every menu on every friday is cheaper than usual', '2020-08-01 12:20:00', NULL, '$10~'),
    (4, 6, 8, 'Christmas Challenge', 'After your dishes, you can try a lottery. If you win, you get $5 discount', '2020-10-30 8:00:00', '2020-12-26', NULL),
    (5, 4, 6, 'Thanks giving promotion', 'More tha $50 payment give us 15% off of the payment', '2020-09-28 16:45:00', '2020-10-15', NULL);
