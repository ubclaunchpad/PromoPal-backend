import React, { CSSProperties, ReactElement } from "react";

import Dropdown from "./button/Dropdown";

import { DropdownMenu as DropdownMenuType } from "../types/Dropdown";

const styles: { [identifier: string]: CSSProperties } = {
  filterBar: {
    backgroundColor: "#ccc",
    padding: 20,
    textAlign: "center",
    width: "100%",
  },
};

export default function DropdownMenu({
  dropdowns
}: DropdownMenuType): ReactElement {
  return (
    <div style={styles.filterBar}>
      {dropdowns.map((dropdown) => (
        <Dropdown {...dropdown} />
      ))}
    </div>
  );
}