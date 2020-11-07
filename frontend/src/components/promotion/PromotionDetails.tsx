import React, { CSSProperties, ReactElement } from "react";
import { HeartOutlined } from "@ant-design/icons";

import { Promotion } from "../../types/Promotion";

const styles: { [identifier: string]: CSSProperties } = {
  descriptionContainer: {
    padding: 10,
    textAlign: "left",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  heart: {
    marginTop: 7,
    textAlign: "right",
  },
};

export default function PromotionDetails(details: Promotion): ReactElement {
  const { title, restaurantName, description, date } = details;

  return (
    <div style={styles.descriptionContainer}>
      <div style={styles.header}>
        <h2>{title}</h2>
        <HeartOutlined style={styles.heart} />
      </div>
      <h3>{restaurantName}</h3>
      <p>{description}</p>
      <p>Expires on {date}</p>
    </div>
  );
}
