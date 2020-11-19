export interface DropdownMenu {
  dropdowns: Dropdown[];
}

export interface Dropdown {
  text: string;
  options: DropdownOption[];
}

export interface DropdownOption {
  action: () => void;
  text: string;
}
