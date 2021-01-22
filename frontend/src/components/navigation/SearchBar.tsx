import React, { CSSProperties, ReactElement } from "react";
import { Input } from "antd";

const { Search } = Input;

const styles: { [identifier: string]: CSSProperties } = {
  search: {
    width: "40%",
  },
};

export default function SearchBar(): ReactElement {
  const onSearch = (value: string) => alert(value);

  return <Search placeholder="Search..." onSearch={onSearch} style={styles.search} />;
}
