import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Checkbox, Col, Dropdown as DD, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { DispatchAction, useDropdown } from "../../contexts/Dropdown";
import { Dropdown as DropdownType, DropdownAction } from "../../types/dropdown";
import "./Dropdown.css";

const styles: { [identifier: string]: CSSProperties } = {
  active: {
    backgroundColor: "#FFC529",
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 20,
    boxShadow: "0 2px 10px 0px #1A333333",
    color: "black",
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  checkbox: {
    paddingLeft: 10,
    width: "100%",
  },
  option: {
    display: "inline",
    top: 0,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
};

/**
 * @component DropdownMultiSelect
 * This component should be used when the user should be allowed to select > 1 option.
 *
 * @param text The text to display on the dropdown button
 * @param options The list of options for this dropdown
 */
export default function DropdownMultiSelect({
  text,
  options,
}: DropdownType): ReactElement {
  /**
   * The list of keys of the selected options
   */
  const [selectedKeys, changeSelectedKeys] = useState<string[]>([]);

  /**
   * Whether the options are visible; needed to override the default behaviour of closing upon select
   */
  const [visible, setVisible] = useState<boolean>(false);

  const { dispatch } = useDropdown();

  const dropdownButtonStyle = {
    ...styles.button,
    ...(selectedKeys.length > 0 && styles.active),
  };

  /**
   * Adds or removes key to selectedKeys array and performs the given action
   */
  const onClickHandler = useCallback(
    (action: DropdownAction, text: string) => {
      let newSelectedKeys = [];
      const textIndex = selectedKeys.indexOf(text);
      if (textIndex >= 0) {
        selectedKeys.splice(textIndex, 1);
        newSelectedKeys = selectedKeys;
      } else {
        newSelectedKeys = [...selectedKeys, text];
      }
      changeSelectedKeys(newSelectedKeys);
      action(newSelectedKeys);
    },
    [selectedKeys]
  );

  /**
   * On component mount, add reset callback to dropdown state
   */
  useEffect(() => {
    dispatch({
      type: DispatchAction.ADD_RESET_CALLBACK,
      payload: { resetCallback: () => changeSelectedKeys([]) },
    });
  }, []);

  const dropdownOptions = (
    <Col style={styles.menu}>
      {options.map(({ action, text }, index) => (
        <Row className="dropdown-option-multi" align="middle" key={index}>
          <Checkbox
            style={styles.checkbox}
            onClick={() => onClickHandler(action, text)}
            checked={selectedKeys.includes(text)}
          >
            <Col style={styles.option}>{text}</Col>
          </Checkbox>
        </Row>
      ))}
    </Col>
  );

  return (
    <DD
      overlay={dropdownOptions}
      onVisibleChange={(flag: boolean) => setVisible(flag)}
      visible={visible}
    >
      <div style={dropdownButtonStyle}>
        {text} <DownOutlined />
      </div>
    </DD>
  );
}
