import React, { useEffect, useState } from "react";
import CardArea from "./cardArea";
import firebase from "./firebase";
import MessageArea from "./messageArea";
import { useAuth } from "./useAuth";
import Lobby from "./lobby";

import "./main.scss";

function App() {

  let user = useAuth(firebase);
  let [route, setRoute] = useState("/");

  useEffect(() => {
    firebase.auth().signInAnonymously();
  }, [user]);

  console.log('user', user);
  const getRoute = route => {
    switch (route) {
      case "/":
        return <Lobby userId={user.uid || null} setRoute={setRoute} />;
      case "game":
        return <CardArea userId={(user.uid||null)} setRoute={setRoute} />;
      default:
        return <div>ya fucked up.</div>;
    }
  };

  return <div className="App">{getRoute(route)}</div>;
}

export default App;
