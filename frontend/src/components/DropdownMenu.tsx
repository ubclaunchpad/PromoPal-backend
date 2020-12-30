import React, { CSSProperties, ReactElement, useCallback } from "react";
import { Col, Row, Typography } from "antd";

import Dropdown from "./dropdown/Dropdown";
import { usePromotionsList } from "../contexts/PromotionsListContext";
import { Dropdown as DropdownType } from "../types/dropdown";

const { Text } = Typography;

const styles: { [identifier: string]: CSSProperties } = {
  clearAll: {
    cursor: "pointer",
    fontSize: "0.8em",
    marginLeft: 10,
    marginRight: 10,
    textDecoration: "underline",
  },
  dropdownMenu: {
    alignItems: "center",
    paddingBottom: 20,
    position: "relative",
    width: "100%",
    zIndex: 1000,
  },
  shadow: {
    boxShadow: "0 4px 4px 0 #40333333",
  },
};

/**
 * @component DropdownMenu
 * This component acts as a container displaying the list of provided dropdowns.
 *
 * @param dropdowns The list of Dropdown objects for this menu with the title of the dropdown button,
 * the dropdown type (radio or multiple select), and the list of options to be selected
 * @param shadow Whether or not to display the surrounding box shadow
 */
export default function DropdownMenu({
  dropdowns,
  shadow = false,
}: {
  dropdowns: DropdownType[];
  shadow?: boolean;
}): ReactElement {
  const { dispatch } = usePromotionsList();

  const dropdownStyle = {
    ...styles.dropdownMenu,
    ...(shadow && styles.shadow),
  };

  /**
   * Set promotion list filter and sort to default
   */
  const handleClearAll = useCallback(() => {
    dispatch({ filter: "DEFAULT", sort: "DEFAULT" });
  }, [dispatch]);

  return (
    <Row id="dropdown-menu" style={dropdownStyle}>
      {dropdowns.map((dropdown) => (
        <Col>
          <Dropdown {...dropdown} />
        </Col>
      ))}
      <Col onClick={handleClearAll} style={styles.clearAll}>
        <Text>Clear All</Text>
      </Col>
    </Row>
  );
}
