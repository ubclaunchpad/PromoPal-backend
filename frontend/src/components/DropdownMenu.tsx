import React, { CSSProperties, ReactElement } from "react";

import Dropdown from "./button/Dropdown";

import { Dropdown as DropdownType, DropdownOptions } from "../types/Dropdown";

const options: DropdownOptions[] = [
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

const dropdowns: DropdownType[] = [
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

const styles: { [identifier: string]: CSSProperties } = {
  filterBar: {
    backgroundColor: "#ccc",
    padding: 20,
    textAlign: "center",
    width: "100%",
  },
};

export default function DropdownMenu(): ReactElement {
  return (
    <div id="dropdown-menu" style={styles.filterBar}>
      {dropdowns.map((dropdown) => (
        <Dropdown {...dropdown} />
      ))}
    </div>
  );
}
