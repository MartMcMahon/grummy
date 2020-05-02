import React from "react";

import CardArea from "./cardArea";
import MessageArea from "./messageArea";
import {useAuth} from "./useAuth";

import Lobby from "./lobby";

import "./main.scss";

function App() {

  let [userId] = useAuth();

  return (
    <div className="App">
      <CardArea />
    </div>
  );
}

export default App;
