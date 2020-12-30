export interface Dropdown {
  text: string;
  type: DropdownType;
  options: DropdownOption[];
}

export interface DropdownOption {
  action: () => void;
  text: string;
  description?: string;
}

export enum DropdownType {
  Radio,
  MultiSelect,
}
