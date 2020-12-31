export interface Dropdown {
  text: string;
  type: DropdownType;
  options: DropdownOption[];
}

export type DropdownAction = (...args: any[]) => void;

export interface DropdownOption {
  action: DropdownAction;
  text: string;
  description?: string;
}

export enum DropdownType {
  Radio,
  MultiSelect,
}
