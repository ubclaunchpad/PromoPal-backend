import React, { ReactElement } from "react";
import { Select } from "antd";

type OptionType = {
  value: string;
};

export default function MultipleSelect({
  placeholder,
  options,
}: {
  placeholder: string;
  options: OptionType[];
}): ReactElement {
  return (
    <Select showArrow mode="multiple" placeholder={placeholder}>
      {options.map(({ value }: OptionType) => (
        <Select.Option value={value}>{value}</Select.Option>
      ))}
    </Select>
  );
}
