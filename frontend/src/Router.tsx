import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import NavigationBar from "./components/navigation/NavigationBar";
import { PromotionsListProvider } from "./contexts/PromotionsListContext";
import Home from "./screens/Home";
import MyPromotions from "./screens/MyPromotions"
import MyAccount from "./screens/MyAccount"

export default function Router(): ReactElement {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Switch>
          {/* Switches to "My Promos" after login */}
          <Route path="/login">
            {/* <Login /> */}
            <MyPromotions />
          </Route>
          <Route path="/myaccount">
            <MyAccount />
          </Route>
          <Route path="/promotion/upload">{/* <UploadPromotion /> */}</Route>
          <Route path="/">
            <PromotionsListProvider>
              <Home />
            </PromotionsListProvider>
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}
