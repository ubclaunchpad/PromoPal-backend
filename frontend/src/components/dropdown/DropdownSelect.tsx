import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useState,
} from "react";
import { Col, Dropdown, Radio } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { Dropdown as DropdownType } from "../../types/dropdown";
import { DropdownAction } from "../../types/dropdown";
import "./Dropdown.css";

const { Group } = Radio;

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
  largeText: {
    fontSize: "1.1em",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  option: {
    display: "inline",
    top: 2,
  },
  optionDescription: {
    fontSize: "0.8em",
    marginLeft: 25,
    color: "gray",
  },
  radio: {
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
  },
};

/**
 * @component DropdownSelect
 * This component should be used when the user should only be allowed to select up to 1 option.
 *
 * @param text The text to display on the dropdown button
 * @param options The list of options for this dropdown
 */
export default function DropdownSelect({
  text,
  options,
}: DropdownType): ReactElement {
  /**
   * The key of the currently selected option
   */
  const [activeKey, setActiveKey] = useState<string>("");

  const dropdownButtonStyle = {
    ...styles.button,
    ...(activeKey && styles.active),
  };

  /**
   * Sets activeKey for this dropdown and performs given action
   */
  const onClickHandler = useCallback((action: DropdownAction, text: string) => {
    setActiveKey(text);
    action(text);
  }, []);

  const dropdownOptions = () => (
    <Col style={styles.menu}>
      <Group name={text} defaultValue={0}>
        {options.map(({ action, description, text }, index) => (
          <Col
            className="dropdown-option-multi"
            key={index}
            style={{ height: description ? 50 : 30 }}
          >
            <Radio
              style={styles.radio}
              value={index}
              onClick={() => onClickHandler(action, text)}
            >
              <Col
                style={{
                  ...styles.option,
                  ...(description && styles.largeText),
                }}
              >
                {text}
              </Col>
              {description && (
                <Col style={styles.optionDescription}>{description}</Col>
              )}
            </Radio>
          </Col>
        ))}
      </Group>
    </Col>
  );

  return (
    <Dropdown overlay={dropdownOptions}>
      <div style={dropdownButtonStyle}>
        {text} <DownOutlined />
      </div>
    </Dropdown>
  );
}
