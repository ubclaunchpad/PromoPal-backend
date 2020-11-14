import React, { ReactElement, useEffect, useState } from "react";

import DropdownMenu from "../components/DropdownMenu";
import MapContainer from "../components/MapContainer";
import PromotionList from "../components/PromotionList";

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
      <DropdownMenu />
      <div id="content-container" style={{ display: "inline-flex", height }}>
        <MapContainer dimensions={{ width: `${mapWidth}vw`, height }} />
        <PromotionList dimensions={{ width: `${100 - mapWidth}vw`, height }} />
      </div>
    </>
  );
}
