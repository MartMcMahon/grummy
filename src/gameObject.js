import { useEffect, useState } from "react";
import firebase from "./firebase";

export const useGameObject = () => {
  let [gameId, setGameId] = useState("0");


  return gameId;
};
