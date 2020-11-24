import React, { CSSProperties, ReactElement } from "react";
import { Button, Input, Space } from "antd";

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    color: "black",
    margin: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FFC529",
    float: "right"
  }
};

export default function ResetPassword(): ReactElement {
  function handleClick() {
    alert("Click")
  }

  return (
      <Space direction="vertical" style={styles.container}>
        <h1 style={{margin: 0}}>Reset Password</h1>
        <p style={{margin: 0}}>Current Password</p>
        <Input.Password placeholder="input password" />
        <p style={{margin: 0}}>New Password</p>
        <Input.Password placeholder="input password" />
        <p style={{margin: 0}}>Confirm New Password</p>
        <Input.Password placeholder="input password" />
        <Button 
          size="large"
          shape="round" 
          onClick={handleClick}
          style={styles.button}
        >
          <div style={{fontWeight: "bold"}}> Save </div>
        </Button>
      </Space>
  );
}