import React, { CSSProperties, ReactElement, useEffect, useState } from "react";

import PromotionCard from "../components/promotion/PromotionCard";
import { DispatchAction, usePromotionsList } from "../contexts/PromotionsListContext";
import { filterPromotions, sortPromotions } from "../services/PromotionService";
import { Promotion } from "../types/promotion";

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    padding: 15,
    paddingBottom: 0,
    overflow: "auto",
  },
};

export default function PromotionList({
  dimensions,
}: {
  dimensions: { width: string; height: string };
}): ReactElement {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const { state, dispatch } = usePromotionsList();

  const containerStyles = {
    marginLeft: `calc(100vw - ${dimensions.width})`,
    ...dimensions,
    ...styles.container,
  };

  /**
   * Fetches promotions satisfying the current query and sorts them
   */
  useEffect(() => {
    dispatch({ type: DispatchAction.DATA_LOADING });
    filterPromotions(state.filter)
      .then((filteredPromotions) => sortPromotions(filteredPromotions, state.sort))
      .then((sortedPromotions) => {
        dispatch({ type: DispatchAction.DATA_SUCCESS });
        setPromotions(sortedPromotions);
      })
      .catch(() => {
        dispatch({ type: DispatchAction.DATA_FAILURE });
        setPromotions([]);
      });
  }, [state.filter, state.sort, dispatch]);

  return (
    <div style={containerStyles}>
      {promotions.map((promotion: Promotion) => (
        <PromotionCard key={promotion.id} {...promotion} />
      ))}
    </div>
  );
}
