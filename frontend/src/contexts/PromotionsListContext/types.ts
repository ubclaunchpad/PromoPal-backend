import { Dispatch } from "react";

import { Sort, FilterOptions, Promotion } from "../../types/promotion";

export enum DispatchAction {
  // Data is being fetched from the API
  DATA_LOADING,
  // Data was successfully fetched
  DATA_SUCCESS,
  // Data fetching failed
  DATA_FAILURE,
  // A filter was selected or removed
  UPDATE_FILTERS,
  // Resets filters to defaults
  RESET_FILTERS,
  // A sort key was selected
  SORT,
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
 * The single source of truth for state related to promotions.
 *
 * @property hasError - Whether or not there was an error with fetching the promotions
 * @property isLoading - Whether or not data is currently being fetched
 * @property data - The entire list of promotions
 * @property filter - The current filters selected to filter the promotions by
 * @property sort - The key which to sort the promotions by
 */
export type State = {
  hasError: boolean;
  isLoading: boolean;
  data: Promotion[];
  filter: FilterOptions;
  sort: Sort;
};
