import React, { CSSProperties, ReactElement } from "react";
import { Button, Col, Rate, Row, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

import { useRestaurantCard } from "../../../contexts/RestaurantCardContext";
import { Restaurant } from "../../../types/restaurant";
import "./Header.css";

const { Text, Title } = Typography;

const styles: { [identifier: string]: CSSProperties } = {
  buttons: {
    paddingBottom: 10,
    paddingTop: 10,
  },
  button: {
    border: "1px solid #FFC529",
    borderRadius: 20,
    boxShadow: "0 4px 4px 0 #40333333",
    fontSize: "0.9em",
    fontWeight: "bold",
    paddingLeft: 8,
    paddingRight: 8,
  },
  closeModal: {
    fontSize: "1.5em",
    color: "#6E798C",
    float: "right",
  },
  container: {
    margin: 20,
    marginBottom: 0,
  },
  detailsText: {
    fontWeight: "bold",
    marginRight: 20,
    marginTop: 10,
    fontSize: "0.9em",
    color: "#6E798C",
  },
  rating: {
    fontSize: "1em",
    padding: 0,
  },
  restaurantName: {
    fontFamily: "ABeeZee",
    margin: 0,
  },
};

export default function Header({
  cuisineType,
  distance,
  name,
  price,
  rating,
  reviews,
  website,
}: Restaurant): ReactElement {
  const { dispatch } = useRestaurantCard();

  const HeaderTitle = () => (
    <Row>
      <Col span={22}>
        <Title level={3} style={styles.restaurantName}>
          {name}
        </Title>
      </Col>
      <Col span={2}>
        <CloseCircleOutlined
          onClick={() => dispatch({ showCard: false })}
          style={styles.closeModal}
        />
      </Col>
    </Row>
  );

  const Buttons = () => (
    <Row align="middle" justify="space-between" style={styles.buttons}>
      <Button style={styles.button}>
        <a style={styles.link} href={website}>
          Website
        </a>
      </Button>
      <Button style={styles.button}>
        <a style={styles.link} href={reviews}>
          Reviews
        </a>
      </Button>
      <Button style={styles.button}>
        {/* TODO: update link */}
        <a style={styles.link} href="/">
          Directions
        </a>
      </Button>
      <Button style={styles.button}>
        {/* TODO: update link */}
        <a style={styles.link} href="/">
          Call
        </a>
      </Button>
    </Row>
  );

  return (
    <Col style={styles.container}>
      <HeaderTitle />
      <Row>
        <Rate allowHalf disabled defaultValue={rating} style={styles.rating} />
      </Row>
      <Row style={styles.details}>
        <Text style={styles.detailsText}>{cuisineType}</Text>
        <Text style={styles.detailsText}>{price}</Text>
        <Text style={styles.detailsText}>{distance}m</Text>
      </Row>
      <Buttons />
    </Col>
  );
}
