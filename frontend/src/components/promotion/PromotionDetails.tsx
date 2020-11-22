import React, { CSSProperties, ReactElement } from "react";
import { Col, Row, Typography } from "antd";
import { ClockCircleOutlined, HeartOutlined } from "@ant-design/icons";

import { Promotion } from "../../types/promotion";

const { Title, Text } = Typography;

const styles: { [identifier: string]: CSSProperties } = {
  description: {
    marginBottom: 0,
  },
  descriptionContainer: {
    paddingLeft: 10,
    textAlign: "left",
    width: "100%",
  },
  footer: {
    fontSize: "0.8em",
    color: "#8B8888",
  },
  header: {
    display: "flex",
    fontFamily: "ABeeZee",
    fontSize: "1em",
    lineHeight: "1em",
  },
  heart: {
    marginTop: -5,
    fontSize: "1.5em",
  },
  promotionName: {
    fontSize: "1.5em",
    fontWeight: "normal",
    marginBottom: 0,
  },
  restaurantName: {
    fontSize: "0.9em",
    lineHeight: "0.9em",
    textDecoration: "underline",
  },
  schedule: {
    color: "#8B8888",
    fontSize: "0.9em",
  },
  scheduleContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
};

export default function PromotionDetails({
  name,
  dateAdded,
  description,
  expirationDate,
  restaurantName = "Restaurant",
}: // TODO: add schedule
Promotion): ReactElement {
  const Info = () => (
    <>
      <Row style={styles.header} justify="space-between">
        <Title style={styles.promotionName}>{name}</Title>
        <HeartOutlined style={styles.heart} />
      </Row>
      <Row>
        <Title style={styles.restaurantName}>{restaurantName}</Title>
      </Row>
      <Row>
        <Text style={styles.description}>{description}</Text>
      </Row>
    </>
  );

  const Schedule = () => (
    <Row style={styles.scheduleContainer}>
      <Col span={2}>
        <ClockCircleOutlined style={{ fontSize: "1em", ...styles.schedule }} />
      </Col>
      <Col span={22}>
        <Row>
          <Text style={styles.schedule}>Tuesday: 10 AM - Late</Text>
        </Row>
        <Row>
          <Text style={styles.schedule}>Wednesday: 7 PM - Late</Text>
        </Row>
      </Col>
    </Row>
  );

  const Footer = () => (
    <Row justify="space-between">
      <Col>
        <Text style={styles.footer}>Expires</Text>
        <Text strong style={styles.footer}>
          {` ${new Date(expirationDate).toDateString()}`}
        </Text>
      </Col>
      <Col>
        <Text style={styles.footer}>8 days ago</Text>
      </Col>
    </Row>
  );

  return (
    <Col style={styles.descriptionContainer}>
      <Info />
      <Schedule />
      <Footer />
    </Col>
  );
}
