import React, { CSSProperties, ReactElement } from "react";
import { Menu, Dropdown as DD } from "antd";
import { DownOutlined } from "@ant-design/icons";

import {
  Dropdown as DropdownType,
  DropdownOptions,
} from "../../types/Dropdown";

function constructOptions(options: DropdownOptions[]): ReactElement {
  return (
    <Menu>
      {options.map(
        ({ link, text }: { link: string; text: string }, index: number) => (
          <Menu.Item key={index}>
            <a href={link}>{text}</a>
          </Menu.Item>
        )
      )}
    </Menu>
  );
}

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    backgroundColor: "white",
    borderRadius: 20,
    color: "black",
    fontWeight: "bold",
    margin: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default function Dropdown({
  text,
  options,
}: DropdownType): ReactElement {
  return (
    <DD overlay={constructOptions(options)}>
      <a
        href="/"
        className="ant-dropdown-link"
        onClick={(e) => e.preventDefault()}
        style={styles.button}
      >
        {text} <DownOutlined />
      </a>
    </DD>
  );
}
