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
    width: "350px",
  },
};

export default function RestaurantCard({
  left,
  ...restaurant
}: { left: string } & Restaurant): ReactElement {
  const containerPadding = "15px";
  return (
    <Col
      style={{
        ...styles.container,
        left: `calc(${left} - ${containerPadding} - ${styles.container.width})`,
      }}
    >
      <Header {...restaurant} />
      <Body {...restaurant} />
    </Col>
  );
}
