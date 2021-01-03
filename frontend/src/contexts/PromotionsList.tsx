import React, {
  createContext,
  Dispatch,
  ReactElement,
  useContext,
  useReducer,
  useEffect,
} from "react";

import { promotionsListReducer } from "../reducers/PromotionsList";
import { getPromotions } from "../services/PromotionService";
import { Sort, FilterOptions, Promotion } from "../types/promotion";

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
type Context = {
  state: State;
  dispatch: Dispatch<DispatchParams>;
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

export const defaultFilters: FilterOptions = {
  cuisineType: "",
  dayOfWeek: [],
  discountType: "",
  promotionType: [],
};

export const defaultSort = Sort.Default;

const initialState: State = {
  isLoading: false,
  hasError: false,
  data: [],
  filter: defaultFilters,
  sort: defaultSort,
};

const PromotionsListContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

/**
 * The context provider component for promotions.
 *
 * @param children - The child components or elements
 */
export function PromotionsListProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [state, dispatch] = useReducer(promotionsListReducer, initialState);

  /**
   * On component mount, fetch promotions and set them on the state.
   */
  useEffect(() => {
    dispatch({ type: DispatchAction.DATA_LOADING });
    getPromotions()
      .then((promotions: Promotion[]) => {
        const payload = { promotions };
        dispatch({ type: DispatchAction.DATA_SUCCESS, payload });
      })
      .catch(() => {
        const payload = { promotions: [] };
        dispatch({ type: DispatchAction.DATA_FAILURE, payload });
      });
  }, []);

  return (
    <PromotionsListContext.Provider value={{ state, dispatch }}>
      {children}
    </PromotionsListContext.Provider>
  );
}

/**
 * Use this function to access the context object.
 */
export function usePromotionsList(): Context {
  const context = useContext(PromotionsListContext);
  if (!context) {
    throw new Error(
      "usePromotionsState must be used within a PromotionsProvider"
    );
  }
  return context;
}
