import React, { CSSProperties, ReactElement } from "react";
import { Button, Input, Space } from "antd";
import { User } from "../../types/promotion";

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

export default function AccountDetails({ 
  id,
  email,
  firstName,
  lastName,
  password,
  username
}: User): ReactElement {
  function handleClick() {
    alert("Click")
  }

  return (
      <Space direction="vertical" style={styles.container}>
        <h1 style={{margin: 0}}>Account Details</h1>
        <p style={{margin: 0}}>First Name</p>
        <Input defaultValue={firstName}/>
        <p style={{margin: 0}}>Last Name</p>
        <Input defaultValue={lastName}/>
        <p style={{margin: 0}}>Username</p>
        <Input defaultValue={username}/>
        <p style={{margin: 0}}>Email</p>
        <Input defaultValue={email}/>
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