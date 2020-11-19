export interface DropdownMenu {
  dropdowns: Dropdown[];
}

export interface Dropdown {
  text: string;
  options: DropdownOption[];
}

export interface DropdownOption {
  link: string;
  text: string;
}
