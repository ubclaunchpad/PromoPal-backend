import React, { CSSProperties, ReactElement } from "react";

import { User } from "../types/promotion";
import AccountPhoto from "../components/account/AccountPhoto";
import AccountDetails from "../components/account/AccountDetails";
import ResetPassword from "../components/account/ResetPassword";

const user: User = {
  id: "u1",
  email: "example@abc.com",
  firstName: "John",
  lastName: "Lee",
  password: "123",
  username: "user",
}

const styles: { [identifier: string]: CSSProperties } = {
  body: {
    backgroundColor: "#FFEDDC",
    padding: 20,
    paddingTop: 20,
    width: "100%",
    display: "inline-flex"
  },
};

export default function MyAccount(): ReactElement {
  return (
    <>
      <div style={styles.body}>
        <AccountPhoto />
        <AccountDetails {...user}/>
        <ResetPassword />
      </div>
    </>
  );
}
