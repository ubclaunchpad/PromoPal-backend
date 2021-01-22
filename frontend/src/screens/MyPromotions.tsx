import React, { CSSProperties, ReactElement } from "react";
import { Checkbox, Row, Col } from "antd";

import DropdownMenu from "../components/DropdownMenu";
import PromotionCard from "../components/promotion/PromotionCard";
import UploadPromoButton from "../components/button/UploadPromoButton";

import { Dropdown, DropdownType } from "../types/dropdown";
import { Promotion, Schedule, User } from "../types/promotion";

const dropdowns: Dropdown[] = [
  {
    text: "Sort",
    type: DropdownType.Radio,
    options: [
      {
        action: () => {
          /* stub */
        },
        description: "Sort by Option 1",
        text: "Option 1",
      },
      {
        action: () => {
          /* stub */
        },
        description: "Sort by Option 2",
        text: "Option 2",
      },
      {
        action: () => {
          /* stub */
        },
        description: "Sort by Option 3",
        text: "Option 3",
      },
    ],
  },
  {
    text: "Category",
    type: DropdownType.MultiSelect,
    options: [
      {
        action: () => {
          /* stub */
        },
        text: "Option 1",
      },
      {
        action: () => {
          /* stub */
        },
        text: "Option 2",
      },
      {
        action: () => {
          /* stub */
        },
        text: "Option 3",
      },
    ],
  },
];

const user: User = {
  id: "u1",
  email: "example@abc.com",
  firstName: "John",
  lastName: "Lee",
  password: "123",
  username: "user",
};

const schedules: Schedule[] = [
  {
    id: "s1",
    dayOfWeek: "Monday",
    endTime: "11:00:00",
    startTime: "08:00:00",
    isRecurring: false,
  },
  {
    id: "s2",
    dayOfWeek: "Friday",
    endTime: "20:00:00",
    startTime: "17:00:00",
    isRecurring: true,
  },
];

const promotions: Promotion[] = [
  {
    id: "1",
    category: "Drinks",
    cuisine: "American",
    dateAdded: "Nov 10, 2020",
    description: "Buy one, get one free on all Grande sized drinks!",
    discount: {
      id: "d1",
      discountValue: 5,
      discountType: "$",
    },
    expirationDate: "Nov 11, 2020",
    liked: false,
    image: { src: "" },
    name: "Happy Hour 2pm-4pm",
    promotionType: "Happy Hour",
    restaurantName: "Starbucks",
    schedules,
    user,
  },
  {
    id: "2",
    category: "Lunch",
    cuisine: "American",
    dateAdded: "Nov 10, 2020",
    description: "Get $2 off any sandwich of your choice.",
    discount: {
      id: "d2",
      discountValue: 2,
      discountType: "$",
    },
    expirationDate: "Nov 20, 2020",
    liked: false,
    image: { src: "" },
    name: "$2 off Sandwiches",
    promotionType: "Lunch Special",
    restaurantName: "Grandma Loves You",
    schedules,
    user,
  },
  {
    id: "3",
    category: "Lunch",
    cuisine: "American",
    dateAdded: "Nov 15, 2020",
    description: "Get 10% off of your order (pre-tax) when you spend over $15 on breakfast.",
    discount: {
      id: "d2",
      discountValue: 2,
      discountType: "$",
    },
    expirationDate: "Jan 1, 2020",
    liked: false,
    image: { src: "" },
    name: "10% off Breakfast",
    promotionType: "Coupon",
    restaurantName: "Elephant Grind Coffee House",
    schedules,
    user,
  },
];

const dropdownMenuWidth = 30;
const styles: { [identifier: string]: CSSProperties } = {
  body: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 20,
    width: "100%",
  },

  dropdownMenuContainer: {
    width: `${dropdownMenuWidth}%`,
  },

  checkBoxContainer: {
    padding: 20,
    width: `${100 - dropdownMenuWidth}%`,
  },

  promotions: {
    marginTop: 15,
  },

  uploadPromoButtonContainer: {
    position: "fixed",
    bottom: 50,
    right: 50,
  },
};

const onChange = () => {
  /* stub */
};

export default function MyPromotions(): ReactElement {
  return (
    <>
      <div style={styles.body}>
        <h1>Uploaded by you</h1>
        <div style={{ display: "inline-flex", width: "100%" }}>
          <div style={styles.dropdownMenuContainer}>
            <DropdownMenu dropdowns={dropdowns} />
          </div>
          <div style={styles.checkBoxContainer}>
            <Checkbox onChange={onChange} style={{ float: "right" }}>
              Show active deals only
            </Checkbox>
          </div>
        </div>
        <div style={styles.promotions}>
          <Row gutter={16}>
            {promotions.map((promotion: Promotion) => (
              <Col span={12}>
                <PromotionCard {...promotion} />
              </Col>
            ))}
          </Row>
        </div>
        <div style={styles.uploadPromoButtonContainer}>
          <UploadPromoButton />
        </div>
      </div>
    </>
  );
}
