import React, { CSSProperties, ReactElement } from "react";
import { Checkbox, Row, Col } from "antd";

import DropdownMenu from "../components/DropdownMenu";
import PromotionCard from "../components/promotion/PromotionCard";
import UploadPromoButton from "../components/button/UploadPromoButton";

import { DropdownOption, Dropdown } from "../types/dropdown";
import { Promotion, User } from "../types/promotion";

const options: DropdownOption[] = [
  {
    action: () => null,
    text: "Option 1",
  },
  {
    action: () => null,
    text: "Option 2",
  },
  {
    action: () => null,
    text: "Option 3",
  },
];

const dropdowns: Dropdown[] = [
  {
    text: "Sort",
    options,
  },
  {
    text: "Category",
    options,
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
      type: "$",
    },
    expirationDate: "Nov 11, 2020",
    liked: false,
    image: { src: "" },
    name: "Happy Hour 2pm-4pm",
    placeId: "r1",
    restaurantName: "Starbucks",
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
      type: "$",
    },
    expirationDate: "Nov 20, 2020",
    liked: false,
    image: { src: "" },
    name: "$2 off Sandwiches",
    placeId: "r2",
    restaurantName: "Grandma Loves You",
    user,
  },
  {
    id: "3",
    category: "Lunch",
    cuisine: "American",
    dateAdded: "Nov 15, 2020",
    description:
      "Get 10% off of your order (pre-tax) when you spend over $15 on breakfast.",
    discount: {
      id: "d2",
      discountValue: 2,
      type: "$",
    },
    expirationDate: "Jan 1, 2020",
    liked: false,
    image: { src: "" },
    name: "10% off Breakfast",
    placeId: "r3",
    restaurantName: "Elephant Grind Coffee House",
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

function onChange() {
  return null;
}

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
