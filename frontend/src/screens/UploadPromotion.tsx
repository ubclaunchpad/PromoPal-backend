import React, { CSSProperties, ReactElement } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Radio,
  Row,
  Col,
  DatePicker,
  TimePicker,
} from "antd";

import MultipleSelect from "../components/input/MultipleSelect";

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    paddingLeft: 200,
    paddingRight: 200,
    paddingTop: 50,
    paddingBottom: 50,
  },
  formItem: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: "2rem",
    textAlign: "center",
  },
  radioGroup: {
    display: "inline-flex",
    justifyContent: "space-around",
    width: "100%",
  },
};

export default function UploadPromotion(): ReactElement {
  const title = "I want to share a deal!";

  const onFinish = () => {
    /* stub */
  };
  const onFinishFailed = () => {
    /* stub */
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { flex: 1 },
  };
  const centerLayout = {
    wrapperCol: { span: 16 },
  };

  const cuisineTypeOptions = [
    "American",
    "Canadian",
    "Chinese",
    "French",
    "Greek",
    "Indian",
    "Indonesian",
    "Lebanese",
    "Russian",
    "Vietnamese",
  ];

  const categoryTypeOptions = [
    "Happy Hour",
    "10% off",
    "25% off",
    "50% off",
    "BOGO",
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{title}</h1>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Promotion Name"
          name="promotionName"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Please input a name for the promotion!",
            },
          ]}
          style={styles.formItem}
        >
          <Input
            placeholder="e.g. 10% off Happy Hour Menu"
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label="Restaurant Name"
          name="restaurantName"
          labelAlign="left"
          rules={[
            { required: true, message: "Please input the restaurant's name!" },
          ]}
          style={styles.formItem}
        >
          <Input placeholder="e.g. Au Comptoir" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Restaurant Address"
          name="restaurantAddress"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: "Please input the restaurant's address!",
            },
          ]}
          style={styles.formItem}
        >
          <Input placeholder="e.g. 2278 W 4th Ave, Vancouver, BC V6K 1N8" />
        </Form.Item>

        <Form.Item
          label="Type of Deal"
          name="typeOfDeal"
          labelAlign="left"
          rules={[{ required: true, message: "Please select a deal type!" }]}
          style={styles.formItem}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Radio.Group defaultValue="none" style={styles.radioGroup}>
            <Radio value="percentageOff">Percentage Off</Radio>
            <Radio value="dollarsOff">Dollars Off</Radio>
            <Radio value="none">N/A</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Cuisine Type"
          name="cuisineType"
          labelAlign="left"
          style={styles.formItem}
        >
          <MultipleSelect
            placeholder="Select a cuisine type"
            options={cuisineTypeOptions.map((type) => ({ value: type }))}
          />
        </Form.Item>

        <Form.Item
          label="Category Type"
          name="categoryType"
          labelAlign="left"
          style={styles.formItem}
        >
          <MultipleSelect
            placeholder="Select a category type"
            options={categoryTypeOptions.map((type) => ({ value: type }))}
          />
        </Form.Item>

        <Form.Item
          label="Promotion Details"
          name="promotionDetails"
          labelAlign="left"
          style={styles.formItem}
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>

        <Form.Item
          label="Times"
          name="promotionTimes"
          labelAlign="left"
          style={styles.formItem}
        >
          <Checkbox.Group style={{ width: "100%" }}>
            {daysOfWeek.map((day) => (
              <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Col span={4}>
                  <Checkbox value={day}>{day}</Checkbox>
                </Col>
                <Col>
                  <TimePicker.RangePicker
                    use12Hours
                    minuteStep={15}
                    format="h:mm a"
                  />
                </Col>
              </Row>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Dates Effective:"
          name="datesEffective"
          labelAlign="left"
          style={styles.formItem}
        >
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item {...centerLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
