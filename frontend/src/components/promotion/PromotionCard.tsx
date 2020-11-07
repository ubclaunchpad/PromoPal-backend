import React, { CSSProperties, ReactElement } from "react";
import { Card } from "antd";

import PromotionDetails from "../promotion/PromotionDetails";
import PromotionImage from "../promotion/PromotionImage";
import { Promotion } from "../../types/Promotion";

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    display: "inline-flex",
    textAlign: "left",
    width: "100%",
  },
  card: {
    display: "inline-block",
    marginBottom: 15,
    width: "100%",
  },
};

export default function PromotionCard(promotion: Promotion): ReactElement {
  return (
    <Card style={styles.card} bodyStyle={styles.body}>
      <PromotionImage {...promotion.image} />
      <PromotionDetails {...promotion} />
    </Card>
  );
}
