import React, { CSSProperties, ReactElement, useCallback } from "react";
import { Card } from "antd";

import { useRestaurantCard } from "../../contexts/RestaurantCardContext";
import PromotionDetails from "../promotion/PromotionDetails";
import PromotionImage from "../promotion/PromotionImage";
import { getRestaurant } from "../../services/promotions";
import { Promotion } from "../../types/promotion";
import { Restaurant } from "../../types/restaurant";

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    display: "inline-flex",
    padding: 10,
    textAlign: "left",
    width: "100%",
  },
  card: {
    borderRadius: 15,
    borderWidth: 0,
    boxShadow: "2px 2px 4px 0px #40333333",
    cursor: "pointer",
    display: "inline-block",
    marginBottom: 15,
    width: "100%",
  },
};

export default function PromotionCard(promotion: Promotion): ReactElement {
  const { state, dispatch } = useRestaurantCard();

  /**
   * Gets the restaurant associated with the clicked promotion and toggles visible state of restaurant details card.
   *
   * Shows the restaurant card if:
   * - card was previously closed
   * - clicked restaurant differs from restaurant currently being shown
   *
   * Hides the restaurant card if:
   * - card is currently open and we click the associated promotion
   * - matching restaurant results in an error
   */
  const onClickHandler = useCallback(async () => {
    return getRestaurant(promotion)
      .then((restaurant: Restaurant) => {
        const isOpeningRestaurantCard = !state.showCard;
        const isNewRestaurant =
          state.showCard && state.restaurant.id !== restaurant.id;
        const showCard = isNewRestaurant || isOpeningRestaurantCard;
        dispatch({ showCard, restaurant });
      })
      .catch(() => dispatch({ showCard: false }));
  }, [state, dispatch, promotion]);

  return (
    <Card style={styles.card} bodyStyle={styles.body} onClick={onClickHandler}>
      <PromotionImage {...promotion.image} />
      <PromotionDetails {...promotion} />
    </Card>
  );
}
