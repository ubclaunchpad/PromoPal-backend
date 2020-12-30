import React, { ReactElement, useEffect, useState } from "react";

import DropdownMenu from "../components/DropdownMenu";
import MapContainer from "../components/MapContainer";
import PromotionList from "../components/PromotionList";
import { usePromotionsList } from "../contexts/PromotionsListContext";
import * as Promotion from "../types/promotion";
import { Dropdown, DropdownType } from "../types/dropdown";

const mapWidth = 60;

export default function Home(): ReactElement {
  const [height, setHeight] = useState<string>("");

  const { dispatch } = usePromotionsList();

  const dropdowns: Dropdown[] = [
    {
      text: "Sort",
      type: DropdownType.Radio,
      options: [
        {
          action: () => dispatch({ sort: Promotion.Sort.Distance }),
          text: "Distance",
          description: "Closest deals to you.",
        },
        {
          action: () => dispatch({ sort: Promotion.Sort.MostPopular }),
          text: "Most Popular",
          description: "Deals with the most number of saves from other users.",
        },
        {
          action: () => dispatch({ sort: Promotion.Sort.Rating }),
          text: "Rating",
          description: "Newest uploaded deals will be shown first.",
        },
      ],
    },
    {
      text: "Discount Type",
      type: DropdownType.MultiSelect,
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
      type: DropdownType.MultiSelect,
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
      text: "Day of the Week",
      type: DropdownType.MultiSelect,
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
      type: DropdownType.MultiSelect,
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
      <DropdownMenu dropdowns={dropdowns} shadow />
      <div id="content-container" style={{ display: "inline-flex", height }}>
        <MapContainer dimensions={{ width: `${mapWidth}vw`, height }} />
        <PromotionList dimensions={{ width: `${100 - mapWidth}vw`, height }} />
      </div>
    </>
  );
}
