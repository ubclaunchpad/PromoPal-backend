import React, {
  createContext,
  Dispatch,
  ReactElement,
  useContext,
  useReducer,
  useEffect,
} from "react";

import * as Promotions from "../services/promotions";
import { Promotion, FilterBy, SortBy } from "../types/promotion";

type State = {
  sort: SortBy;
  filter: FilterBy;
  promotions: Promotion[];
};

type DispatchParams = {
  filter?: FilterBy;
  sort?: SortBy;
  promotions?: Promotion[];
};

type Context = {
  state: State;
  dispatch: Dispatch<DispatchParams>;
};

const initialState: State = {
  sort: "DEFAULT",
  filter: "DEFAULT",
  promotions: [],
};

const PromotionsListContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

function promotionsListReducer(
  state: State,
  { filter, sort, promotions }: DispatchParams
): State {
  let nextState = state;
  if (filter) {
    nextState = { ...nextState, filter };
  }
  if (sort) {
    nextState = { ...nextState, sort };
  }
  if (promotions) {
    nextState = { ...nextState, promotions };
  }
  return nextState;
}

export function PromotionsListProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [state, dispatch] = useReducer(promotionsListReducer, initialState);

  useEffect(() => {
    Promotions.get()
      .then((promotions: Promotion[]) =>
        dispatch({ filter: "DEFAULT", sort: "DEFAULT", promotions })
      )
      .catch(() =>
        dispatch({ filter: "DEFAULT", sort: "DEFAULT", promotions: [] })
      );
  }, []);

  return (
    <PromotionsListContext.Provider value={{ state, dispatch }}>
      {children}
    </PromotionsListContext.Provider>
  );
}

export function usePromotionsList(): Context {
  const context = useContext(PromotionsListContext);
  if (!context) {
    throw new Error(
      "usePromotionsState must be used within a PromotionsProvider"
    );
  }
  return context;
}
