import React, {
  createContext,
  Dispatch,
  ReactElement,
  useContext,
  useReducer,
  useEffect,
} from "react";

import { Restaurant } from "../types/restaurant";
import { usePromotionsList } from "./PromotionsListContext";

type State = {
  showCard: boolean;
  restaurant: Restaurant;
};

type DispatchParams = {
  showCard: boolean;
  restaurant?: Restaurant;
};

type Context = {
  state: State;
  dispatch: Dispatch<DispatchParams>;
};

const initialState: State = {
  showCard: false,
  restaurant: {} as Restaurant,
};

/**
 * RestaurantCardContext: holds the most up-to-date context object.
 */
const RestaurantCardContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

/**
 * restaurantCardReducer: reducer for managing state of restaurant card.
 *
 * If card is currently visible, hide the card. Otherwise, card is currently hidden and we set the restaurant
 * to the given restaurant (if not given, use the current restaurant in state).
 */
function restaurantCardReducer(state: State, action: DispatchParams): State {
  if (!action.showCard) {
    return { showCard: false, restaurant: {} as Restaurant };
  }
  return { showCard: true, restaurant: action.restaurant || state.restaurant };
}

/**
 * RestaurantCardProvider: inject in component hierarchy where needed. Then, context can be accessed in child
 * components by using the `useRestaurantCard` function defined below.
 */
export function RestaurantCardProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const [state, dispatch] = useReducer(restaurantCardReducer, initialState);

  const PromotionsContext = usePromotionsList();

  useEffect(() => {
    /**
     * On first load, set showCard to false to hide restaurant card.
     */
    dispatch({ showCard: false });
  }, []);

  useEffect(() => {
    /**
     * If filter or sort keys for promotions change (i.e., dropdown buttons are used), hide the restaurant card.
     */
    dispatch({ showCard: false });
  }, [PromotionsContext.state.filter, PromotionsContext.state.sort]);

  return (
    <RestaurantCardContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantCardContext.Provider>
  );
}

/**
 * useRestaurantCard: function for accessing current context object.
 * Destructure the return value to access `state` and `dispatch`.
 */
export function useRestaurantCard(): Context {
  const context = useContext(RestaurantCardContext);
  if (!context) {
    throw new Error(
      "useRestaurantCard must be used within a RestaurantCardContext"
    );
  }
  return context;
}
