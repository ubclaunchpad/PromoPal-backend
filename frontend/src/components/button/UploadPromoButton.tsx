import React, { CSSProperties, ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const styles: { [identifier: string]: CSSProperties } = {
  button: {
    backgroundColor: "#ccc",
    color: "black",
  },
};

export default function UploadPromoButton(): ReactElement {
  const history = useHistory();

  function handleClick() {
    history.push("/promotion/upload");
  }

  return (
    <Button 
      shape="circle" 
      icon={<PlusOutlined />} 
      onClick={handleClick}
      style={styles.button}
      />
  );
}
