import {
  defaultFilters,
  defaultSort,
  DispatchAction,
  DispatchParams,
  State,
} from "../contexts/PromotionsList";
import { Promotion, FilterOptions, Sort } from "../types/promotion";

export function promotionsListReducer(
  state: State,
  { type, payload }: DispatchParams
): State {
  let nextState = state;

  switch (type) {
    /**
     * Sets state.isLoading to true.
     */
    case DispatchAction.DATA_LOADING:
      nextState = {
        ...nextState,
        hasError: false,
        isLoading: true,
      };
      break;
    /**
     * Sets state.isLoading to false and state.hasError to false.
     */
    case DispatchAction.DATA_SUCCESS: {
      const { promotions } = payload as { promotions: Promotion[] };
      nextState = {
        ...nextState,
        data: promotions,
        hasError: false,
        isLoading: false,
      };
      break;
    }
    /**
     * Sets state.isLoading to false and state.hasError to true.
     * Updates state.data to be either given promotions or previous promotions set on state if undefined.
     */
    case DispatchAction.DATA_FAILURE: {
      const { promotions } = payload as { promotions: Promotion[] };
      nextState = {
        ...nextState,
        data: promotions ?? state.data,
        isLoading: false,
        hasError: true,
      };
      break;
    }
    /**
     * Replaces filters with the currently selected filters.
     */
    case DispatchAction.UPDATE_FILTERS: {
      const { filter } = payload as { filter: Partial<FilterOptions> };
      nextState = {
        ...nextState,
        filter: {
          ...state.filter,
          ...filter,
        },
      };
      break;
    }
    /**
     * Resets filters and sort key to defaults.
     */
    case DispatchAction.RESET_FILTERS: {
      nextState = {
        ...nextState,
        filter: defaultFilters,
        sort: defaultSort,
      };
      break;
    }
    /**
     * Sets sort key.
     */
    case DispatchAction.SORT: {
      const { sort } = payload as { sort: Sort };
      nextState = { ...nextState, sort };
      break;
    }
    default:
      break;
  }

  return nextState;
}
