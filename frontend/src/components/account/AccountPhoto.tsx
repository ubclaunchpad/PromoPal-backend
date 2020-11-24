import React, { CSSProperties, ReactElement } from "react";
import { Button, Input, Space } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { UserOutlined } from "@ant-design/icons";

const styles: { [identifier: string]: CSSProperties } = {
  container: {
    color: "black",
    margin: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FFC529",
  }
};

export default function AccountPhoto(): ReactElement {
  function handleClick() {
    alert("Click")
  }

  return (
    <div style={styles.container}> 
      <Avatar size={128} icon={<UserOutlined />} />
      <Button 
        size="large"
        shape="round" 
        onClick={handleClick}
        style={styles.button}
      >
        <div style={{fontWeight: "bold"}}> Update Photo </div>
      </Button>
      <p style={{marginTop: 10, textDecoration: "underline"}}> Delete Account</p>
    </div>
  );
}