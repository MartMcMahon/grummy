import React, { useState } from "react";

import CardArea from "./cardArea";
import MessageArea from "./messageArea";
import { useAuth } from "./useAuth";

import Lobby from "./lobby";

import "./main.scss";

function App() {
  let [userId] = useAuth();
  let [route, setRoute] = useState("/");

  const getRoute = route => {
    switch (route) {
      case "/":
        return <Lobby setRoute={setRoute} />;
      case "game":
        return <CardArea />;
      default:
        return <div>ya fucked up.</div>;
    }
  };

  return <div className="App">{getRoute(route)}</div>;
}

export default App;
