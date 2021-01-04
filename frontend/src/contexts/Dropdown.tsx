import React, {
  createContext,
  Dispatch,
  ReactElement,
  useContext,
  useReducer,
} from "react";

import { dropdownReducer } from "../reducers/Dropdown";

export enum DispatchAction {
  // Adds given callback to list, all callbacks called
  ADD_RESET_CALLBACK,
}

/**
 * @type DropdownContext
 * The context to be provided through the component tree.
 *
 * @property state - The current state
 * @property dispatch - The function used to update the state
 */
type DropdownContext = {
  state: State;
  dispatch: Dispatch<DispatchParams>;
};

/**
 * @type State
 * The state for managing dropdown options.
 *
 * @property resetCallbacks - The functions to call when the "Clear All" button has been pressed
 */
export type State = {
  resetCallbacks: Array<() => void>;
};

/**
 * @type DispatchParams
 * The parameters and their types for the dispatch call (for updating state).
 *
 * @property type - The type of action performed
 * @property payload? - Any data needed to update the state
 */
export type DispatchParams = {
  type: DispatchAction;
  payload?: unknown;
};

const initialState: State = { resetCallbacks: [] };

const DropdownContext = createContext<DropdownContext>({
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
    <DropdownContext.Provider value={{ state, dispatch }}>
      {children}
    </DropdownContext.Provider>
  );
}

/**
 * Use this function to access the context object.
 */
export function useDropdown(): DropdownContext {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }
  return context;
}
