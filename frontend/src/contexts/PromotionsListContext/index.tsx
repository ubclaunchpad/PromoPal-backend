import React, { createContext, ReactElement, useContext, useReducer, useEffect } from "react";

import { promotionsListReducer } from "../../reducers/PromotionsList";
import { getPromotions } from "../../services/PromotionService";
import { Sort, FilterOptions, Promotion } from "../../types/promotion";

import { Context, DispatchAction, DispatchParams, State } from "./types";

export const defaultFilters: FilterOptions = {
  cuisine: [],
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
 * @component PromotionsListProvider
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
    throw new Error("usePromotionsList must be used within a PromotionsProvider");
  }
  return context;
}

/* Re-export types */
export type { Context, DispatchParams, State };
export { DispatchAction };
