import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "./cards";
// import firebase from "./firebase";

let api_root = "https://grummy.mart.pizza:8080";
if (process.env.NODE_ENV === "development") {
  api_root = "http://localhost:6969";
}

const default_gameObject = {
  table: [[], [], [], []],
}

export const useGameObject = userId => {
  let [gameId, setGameId] = useState("0");
  let [chair, setChair] = useState(0);
  let [game, setGame] = useState(default_gameObject);

  // actions
  const draw = event => {
    console.log('draw');
    axios.get(`${api_root}/draw/?userId=${userId}`).then(res => {
      const newHand = res.data.hand.map(base_card => new Card(base_card));
      setGame({...game, hand: newHand});
    });
  }

  useEffect(() => {
    axios
      .get(`${api_root}/game_status`)
      .then(res => {
        setGameId(res.data.id);
      })
      .then(() => {
        axios.put(`${api_root}/register_player?userId=${userId}`).then(res => {
          setChair(res.data.chair);
        });
      });
  }, [gameId, userId]);

  useEffect(() => {
    const game_pinger = setInterval(() => {
      axios.get(`${api_root}/state?userId=${userId}`).then(res => {
        console.log("state request", res);
        const new_table = res.data.table.map((played_cards, i) =>
          res.data.table[(i + chair) % 4].map(card => new Card(card))
        );

        setGame({
          table: new_table
        });
        console.log("chair", chair);
        console.log("new table", new_table);
        // setTable(new_table);
        // setHand(res.data.hand.map(card => new Card(card)));
        // setDiscard(res.data.discard.map(card => new Card(card)));
        // setTurn(res.data.turn);
        // setPhase(res.data.phase);
      });
    }, 2000);
    return () => {
      clearInterval(game_pinger);
    };
  }, [chair, userId]);

  return [game, e => draw(e)];
};
