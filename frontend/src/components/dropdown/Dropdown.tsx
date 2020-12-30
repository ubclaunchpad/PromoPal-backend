import React, { ReactElement } from "react";

import { Dropdown as DDType, DropdownType } from "../../types/dropdown";
import DropdownMultiSelect from "./DropdownMultiSelect";
import DropdownSelect from "./DropdownSelect";

/**
 * @component Dropdown
 * This component abstracts a single dropdown, using radio buttons for options if the type is Dropdown.Radio
 * and using checkboxes for options if the type is Dropdown.MultiSelect.
 *
 * @param dropdown Object with the title of the dropdown button, the dropdown type (radio or multiple select),
 * and the list of options to be selected
 */
export default function Dropdown(dropdown: DDType): ReactElement {
  const { type } = dropdown;

  switch (type) {
    case DropdownType.Radio:
      return <DropdownSelect {...dropdown} />;
    case DropdownType.MultiSelect:
      return <DropdownMultiSelect {...dropdown} />;
    default:
      throw new Error(`DropdownType ${type} is not a valid choice.`);
  }
}

export { DropdownSelect, DropdownMultiSelect };
