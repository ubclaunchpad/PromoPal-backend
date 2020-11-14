import React, { CSSProperties, ReactElement } from "react";

import DropdownMenu from "../components/DropdownMenu";
import PromotionCard from "../components/promotion/PromotionCard";

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
    text: "Discount Type",
    options,
  },
  {
    text: "Cuisine",
    options,
  },
  {
    text: "Category",
    options,
  },
  {
    text: "Price",
    options,
  },
  {
    text: "Day of the Week",
    options,
  },
  {
    text: "Dine In Available",
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

const mapWidth = 60;
const styles: { [identifier: string]: CSSProperties } = {
  mapContainer: {
    width: `${mapWidth}%`,
  },
  promotions: {
    margin: 15,
    marginBottom: 0,
    width: `${100 - mapWidth}%`,
  },
};

export default function Home(): ReactElement {
  return (
    <>
      <DropdownMenu dropdowns={dropdowns}/>
      <div style={{ display: "inline-flex" }}>
        <div style={styles.mapContainer}></div>
        <div style={styles.promotions}>
          {promotions.map((promotion: Promotion) => (
            <PromotionCard {...promotion} />
          ))}
        </div>
      </div>
    </>
  );
}
