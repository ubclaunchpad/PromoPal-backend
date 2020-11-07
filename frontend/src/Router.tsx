import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NavigationBar from "./components/navigation/NavigationBar";
import Home from "./screens/Home";

export default function Router(): ReactElement {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Switch>
          <Route path="/login">{/* <Login /> */}</Route>
          <Route path="/promotion/upload">{/* <UploadPromotion /> */}</Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}
