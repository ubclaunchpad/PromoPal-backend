import React, { ReactElement } from "react";

import PromotionCard from "./components/promotion/PromotionCard";
import { Promotion } from "./types/Promotion";

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

function App(): ReactElement {
  const mapWidth = 60;

  return (
    <div className="App">
      <div style={{ display: "inline-flex" }}>
        <div style={{ width: `${mapWidth}%` }}></div>
        <div style={{ width: `${100 - mapWidth}%` }}>
          {promotions.map((promotion: Promotion) => (
            <PromotionCard {...promotion} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
