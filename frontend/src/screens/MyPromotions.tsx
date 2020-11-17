import React, { CSSProperties, ReactElement } from "react";
import { Checkbox, Row, Col } from 'antd';

import DropdownMenu from "../components/DropdownMenu";
import PromotionCard from "../components/promotion/PromotionCard";
import UploadPromoButton from "../components/button/UploadPromoButton";

import { DropdownOption, Dropdown} from "../types/Dropdown";
import { Promotion } from "../types/Promotion";

const options: DropdownOption[] = [
  {
    link: "/link1",
    text: "Option 1",
  },
  {
    link: "/link2",
    text: "Option 2",
  },
  {
    link: "/link3",
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

const promotions: Promotion[] = [
  {
    title: "Happy Hour 2pm-4pm",
    restaurantName: "Starbucks",
    description: "Buy one, get one free on all Grande sized drinks!",
    date: "Nov 11, 2020",
    liked: false,
    image: { src: "" },
  },
  {
    title: "$2 off Sandwiches",
    restaurantName: "Grandma Loves You",
    description: "Get $2 off any sandwich of your choice.",
    date: "Nov 20, 2020",
    liked: false,
    image: { src: "" },
  },
  {
    title: "10% off Breakfast",
    restaurantName: "Elephant Grind Coffee House",
    description:
      "Get 10% off of your order (pre-tax) when you spend over $15 on breakfast.",
    date: "Thursday",
    liked: true,
    image: { src: "" },
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
    right: 50
  }
};

function onChange() {
  console.log("Check");
}

export default function MyPromotions(): ReactElement {
  return (
    <>
      <div style={styles.body}>
        <h1>Uploaded by you</h1>
        <div style={{ display: "inline-flex", width: "100%"}}>
          <div style={styles.dropdownMenuContainer}>
            <DropdownMenu dropdowns={dropdowns}/>
          </div>
          <div style={styles.checkBoxContainer}>
            <Checkbox onChange={onChange} style={{ float: "right"}}>Show active deals only</Checkbox>
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
