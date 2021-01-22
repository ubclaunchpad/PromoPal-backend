import { Dispatch } from "react";

export enum DispatchAction {
  // Adds given callback to list, all callbacks called
  ADD_RESET_CALLBACK,
}

/**
 * @type Context
 * The context to be provided through the component tree.
 *
 * @property state - The current state
 * @property dispatch - The function used to update the state
 */
export type Context = {
  state: State;
  dispatch: Dispatch<DispatchParams>;
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

/**
 * @type State
 * The state for managing dropdown options.
 *
 * @property resetCallbacks - The functions to call when the "Clear All" button has been pressed
 */
export type State = {
  resetCallbacks: Array<() => void>;
};
