import React, { CSSProperties, ReactElement } from "react";
import { Col } from "antd";

import Body from "./card/Body";
import Header from "./card/Header";
import { Restaurant } from "../../types/restaurant";

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    boxShadow: "0 4px 4px 0 #40333333",
    marginTop: "5%",
    position: "absolute",
    padding: 0,
    width: 350,
  },
};

export default function RestaurantCard(restaurant: Restaurant): ReactElement {
  return (
    <Col
      style={{
        ...styles.container,
        left: `calc(70% - 15px - ${styles.container.width}px)`,
      }}
    >
      <Header {...restaurant} />
      <Body {...restaurant} />
    </Col>
  );
}
