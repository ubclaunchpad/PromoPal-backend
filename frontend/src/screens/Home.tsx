import React, { ReactElement, useEffect, useState } from "react";

import DropdownMenu from "../components/DropdownMenu";
import MapContainer from "../components/MapContainer";
import PromotionList from "../components/PromotionList";
import { DispatchAction, usePromotionsList } from "../contexts/PromotionsList";
import { getDiscountTypes } from "../services/EnumService";
import { Dropdown, DropdownType } from "../types/dropdown";
import {
  CuisineType,
  DayOfWeek,
  ServiceOptions,
  Sort,
} from "../types/promotion";

const mapWidth = 60;

export default function Home(): ReactElement {
  const [height, setHeight] = useState<string>("");

  // Dropdown options for discount types
  const [discountTypes, setDiscountTypes] = useState<string[]>([]);

  const { dispatch } = usePromotionsList();

  /**
   * On component mount, load dropdown options
   */
  useEffect(() => {
    getDiscountTypes()
      .then((discountTypes) => setDiscountTypes(discountTypes))
      .catch(() => setDiscountTypes([]));
  }, []);

  /**
   * Callback functions when dropdown option is selected
   */
  const actions = {
    cuisineType: (cuisineType: CuisineType[]) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { cuisineType } },
      }),
    dayOfWeek: (dayOfWeek: DayOfWeek[]) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { dayOfWeek } },
      }),
    discountType: (discountType: string[]) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { discountType } },
      }),
    serviceOptions: (serviceOptions: ServiceOptions[]) =>
      dispatch({
        type: DispatchAction.UPDATE_FILTERS,
        payload: { filter: { serviceOptions } },
      }),
  };

  const dropdowns: Dropdown[] = [
    {
      text: "Sort",
      type: DropdownType.Radio,
      options: [
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.Distance },
            }),
          text: "Distance",
          description: "Closest deals to you.",
        },
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.MostPopular },
            }),
          text: "Most Popular",
          description: "Deals with the most number of saves from other users.",
        },
        {
          action: () =>
            dispatch({
              type: DispatchAction.SORT,
              payload: { sort: Sort.Rating },
            }),
          text: "Rating",
          description: "Newest uploaded deals will be shown first.",
        },
      ],
    },
    {
      text: "Discount Type",
      type: DropdownType.Radio,
      options: discountTypes.map((discountType) => ({
        action: actions.discountType,
        text: discountType === "Other" ? "Other" : `${discountType} Off`,
      })),
    },
    {
      text: "Cuisine",
      type: DropdownType.MultiSelect,
      options: [
        {
          action: actions.cuisineType,
          text: "American",
        },
        {
          action: actions.cuisineType,
          text: "Chinese",
        },
        {
          action: actions.cuisineType,
          text: "French",
        },
        {
          action: actions.cuisineType,
          text: "Indian",
        },
        {
          action: actions.cuisineType,
          text: "Italian",
        },
        {
          action: actions.cuisineType,
          text: "Japanese",
        },
        {
          action: actions.cuisineType,
          text: "Korean",
        },
        {
          action: actions.cuisineType,
          text: "Mexican",
        },
        {
          action: actions.cuisineType,
          text: "Vietnamese",
        },
      ],
    },
    {
      text: "Day of the Week",
      type: DropdownType.MultiSelect,
      options: [
        {
          action: actions.dayOfWeek,
          text: "Sunday",
        },
        {
          action: actions.dayOfWeek,
          text: "Monday",
        },
        {
          action: actions.dayOfWeek,
          text: "Tuesday",
        },
        {
          action: actions.dayOfWeek,
          text: "Wednesday",
        },
        {
          action: actions.dayOfWeek,
          text: "Thursday",
        },
        {
          action: actions.dayOfWeek,
          text: "Friday",
        },
        {
          action: actions.dayOfWeek,
          text: "Saturday",
        },
      ],
    },
    {
      text: "Service Options",
      type: DropdownType.MultiSelect,
      options: [
        {
          action: actions.serviceOptions,
          text: "Dine-In",
        },
        {
          action: actions.serviceOptions,
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
