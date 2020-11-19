import React, { ReactElement, useEffect, useState } from "react";

import DropdownMenu from "../components/DropdownMenu";
import MapContainer from "../components/MapContainer";
import PromotionList from "../components/PromotionList";

import { DropdownOption, Dropdown} from "../types/Dropdown";

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

const mapWidth = 60;

export default function Home(): ReactElement {
  const [height, setHeight] = useState<string>("");

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
