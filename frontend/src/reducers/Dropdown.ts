import { DispatchAction, DispatchParams, State } from "../contexts/DropdownContext";

export function dropdownReducer(
  state: State,
  { type, payload }: DispatchParams
): State {
  let nextState = state;

  switch (type) {
    /**
     * Adds the given callback to the list of reset callbacks.
     */
    case DispatchAction.ADD_RESET_CALLBACK: {
      const { resetCallback } = payload as { resetCallback: () => void };
      const resetCallbacks = [...state.resetCallbacks, resetCallback];
      nextState = {
        ...nextState,
        resetCallbacks,
      };
      break;
    }
    default:
      break;
  }

  return nextState;
}
