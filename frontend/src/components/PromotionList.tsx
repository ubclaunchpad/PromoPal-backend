import React, { CSSProperties, ReactElement, useEffect, useState } from "react";

import PromotionCard from "../components/promotion/PromotionCard";
import RestaurantCard from "../components/restaurant/RestaurantCard";
import { usePromotionsList } from "../contexts/PromotionsListContext";
import { useRestaurantCard } from "../contexts/RestaurantCardContext";
import { filterPromotions, sortPromotions } from "../services/promotions";
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

  const { state: promotionsListState } = usePromotionsList();
  const { state: restaurantCardState } = useRestaurantCard();

  const containerStyles = {
    marginLeft: `calc(100vw - ${dimensions.width})`,
    ...dimensions,
    ...styles.container,
  };

  useEffect(() => {
    /**
     * This hook is run everytime the promotionsListState changes.
     * This function sorts and filters the promotions according to the `filter` and `sort` keys
     * so that this component is displaying the appropriate list.
     */
    const { filter, sort, promotions } = promotionsListState;
    const filteredPromotions = filterPromotions(promotions, filter);
    const sortedPromotions = sortPromotions(filteredPromotions, sort);
    setPromotions(sortedPromotions);
  }, [promotionsListState]);

  return (
    <div style={containerStyles}>
      {/* Conditionally render the restaurant card */}
      {restaurantCardState.showCard && (
        <RestaurantCard {...restaurantCardState.restaurant} />
      )}
      {promotions.map((promotion: Promotion) => (
        <PromotionCard key={promotion.id} {...promotion} />
      ))}
    </div>
  );
}
