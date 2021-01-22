import React, { createContext, ReactElement, useContext, useReducer } from "react";

import { dropdownReducer } from "../../reducers/Dropdown";

import { Context, DispatchAction, DispatchParams, State } from "./types";

const initialState: State = { resetCallbacks: [] };

const DropdownContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

/**
 * @component DropdownProvider
 * The context provider component for the dropdown menu.
 *
 * @param children - The child components or elements
 */
export function DropdownProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [state, dispatch] = useReducer(dropdownReducer, initialState);

  return (
    <DropdownContext.Provider value={{ state, dispatch }}>{children}</DropdownContext.Provider>
  );
}

/**
 * Use this function to access the context object.
 */
export function useDropdown(): Context {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }
  return context;
}

/* Re-export types */
export type { Context, DispatchParams, State };
export { DispatchAction };
