import React, { ReactElement, useEffect, useState } from "react";

import DropdownMenu from "../components/DropdownMenu";
import MapContainer from "../components/MapContainer";
import PromotionList from "../components/PromotionList";
import { usePromotionsList } from "../contexts/PromotionsListContext";
import * as Promotion from "../types/promotion";

const mapWidth = 65;

export default function Home(): ReactElement {
  const [height, setHeight] = useState<string>("");

  const { dispatch } = usePromotionsList();

  const dropdowns = [
    {
      text: "Sort",
      options: [
        {
          action: () => dispatch({ sort: Promotion.Sort.Distance }),
          text: "Distance",
        },
        {
          action: () => dispatch({ sort: Promotion.Sort.MostPopular }),
          text: "Most Popular",
        },
        {
          action: () => dispatch({ sort: Promotion.Sort.Rating }),
          text: "Rating",
        },
      ],
    },
    {
      text: "Discount Type",
      options: [
        {
          action: () => dispatch({ filter: Promotion.DiscountType.DollarsOff }),
          text: "$ Off",
        },
        {
          action: () => dispatch({ filter: Promotion.DiscountType.PercentOff }),
          text: "% Off",
        },
      ],
    },
    {
      text: "Cuisine",
      options: [
        {
          action: () => dispatch({ filter: Promotion.CuisineType.American }),
          text: "American",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Chinese }),
          text: "Chinese",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.French }),
          text: "French",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Indian }),
          text: "Indian",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Italian }),
          text: "Italian",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Japanese }),
          text: "Japanese",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Korean }),
          text: "Korean",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Mexican }),
          text: "Mexican",
        },
        {
          action: () => dispatch({ filter: Promotion.CuisineType.Vietnamese }),
          text: "Vietnamese",
        },
      ],
    },
    {
      text: "Category",
      options: [
        {
          action: () => dispatch({ filter: Promotion.Category.Bakery }),
          text: "Bakery",
        },
        {
          action: () => dispatch({ filter: Promotion.Category.BubbleTea }),
          text: "Bubble Tea",
        },
        {
          action: () => dispatch({ filter: Promotion.Category.Coffee }),
          text: "Coffee",
        },
        {
          action: () => dispatch({ filter: Promotion.Category.Dessert }),
          text: "Dessert",
        },
        {
          action: () => dispatch({ filter: Promotion.Category.FastFood }),
          text: "Fast Food",
        },
      ],
    },
    {
      text: "Day of the Week",
      options: [
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Sunday }),
          text: "Sunday",
        },
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Monday }),
          text: "Monday",
        },
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Tuesday }),
          text: "Tuesday",
        },
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Wednesday }),
          text: "Wednesday",
        },
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Thursday }),
          text: "Thursday",
        },
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Friday }),
          text: "Friday",
        },
        {
          action: () => dispatch({ filter: Promotion.DaysOfWeek.Saturday }),
          text: "Saturday",
        },
      ],
    },
    {
      text: "Service Options",
      options: [
        {
          action: () => dispatch({ filter: Promotion.ServiceOptions.DineIn }),
          text: "Dine-In",
        },
        {
          action: () => dispatch({ filter: Promotion.ServiceOptions.TakeOut }),
          text: "Take-Out",
        },
      ],
    },
  ];

  useEffect(() => {
    // Note: the following is not considered best practice, but it is used to calculate the height
    // of the header + dropdown so that we can use it as an offset
    const headerHeight = document.getElementById("navigation-header")
      ?.offsetHeight;
    const dropdownMenuHeight = document.getElementById("dropdown-menu")
      ?.offsetHeight;
    setHeight(`calc(100vh - ${headerHeight}px - ${dropdownMenuHeight}px)`);
  }, []);

  return (
    <>
      <DropdownMenu dropdowns={dropdowns} />
      <div id="content-container" style={{ display: "inline-flex", height }}>
        <MapContainer dimensions={{ width: `${mapWidth}vw`, height }} />
        <PromotionList dimensions={{ width: `${100 - mapWidth}vw`, height }} />
      </div>
    </>
  );
}
