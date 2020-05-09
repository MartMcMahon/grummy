import React, { useState } from "react";

import CardArea from "./cardArea";
import MessageArea from "./messageArea";
import { useAuth } from "./useAuth";

import Lobby from "./lobby";

import "./main.scss";

function App() {
  let user = useAuth();
  let [route, setRoute] = useState("/");

  const getRoute = route => {
    switch (route) {
      case "/":
        return <Lobby userId={user.uid} setRoute={setRoute} />;
      case "game":
        return <CardArea userId={user.uid} setRoute={setRoute} />;
      default:
        return <div>ya fucked up.</div>;
    }
  };

  return <div className="App">{getRoute(route)}</div>;
}

export default App;
