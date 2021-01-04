import React, { CSSProperties, ReactElement, useCallback } from "react";
import { Col, Row, Typography } from "antd";

import Dropdown from "./dropdown/Dropdown";
import { DispatchAction, usePromotionsList } from "../contexts/PromotionsList";
import { Dropdown as DropdownType } from "../types/dropdown";
import { DropdownProvider, useDropdown } from "../contexts/Dropdown";

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

function ClearAllButton(): ReactElement {
  const promotionsList = usePromotionsList();
  const dropdown = useDropdown();

  /**
   * Sets promotion list filter and sort to default and clears dropdowns
   */
  const handleClearAll = useCallback(() => {
    promotionsList.dispatch({ type: DispatchAction.RESET_FILTERS });
    dropdown.state.resetCallbacks.forEach((resetDropdown) => resetDropdown());
  }, [dropdown, promotionsList]);

  return (
    <Col onClick={handleClearAll} style={styles.clearAll}>
      <Text>Clear All</Text>
    </Col>
  );
}

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
  const dropdownStyle = {
    ...styles.dropdownMenu,
    ...(shadow && styles.shadow),
  };

  return (
    <DropdownProvider>
      <Row id="dropdown-menu" style={dropdownStyle}>
        {dropdowns.map((dropdown, index) => (
          <Col key={index}>
            <Dropdown {...dropdown} />
          </Col>
        ))}
        <ClearAllButton />
      </Row>
    </DropdownProvider>
  );
}
