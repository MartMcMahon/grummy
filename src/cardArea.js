import React, { useEffect, useState } from "react";
import axios from "axios";
import firebase from "./firebase";
import { Card, Deck } from "./cards";
import querystring from "querystring";

const api = "http://localhost:6969";

const CardArea = props => {
  let [gameId, setGameId] = useState("0");
  let [gameData, setGameData] = useState({});
  let [turnCount, setTurnCount] = useState(0);
  let [currentTurn, setCurrentTurn] = useState(0);

  let [hand, setHand] = useState([]);
  let [selected, setSelected] = useState([]);
  let [played, setPlayed] = useState([]);
  let [discard, setDiscard] = useState([]);

  let [output, setOutput] = useState("");

  let userId = props.userId;

  useEffect(() => {
    axios.get(`${api}/game_status`).then(res => {
      console.log("cool", res.data.id);
      setGameId(res.data.id);
    });
  }, [gameId]);

  useEffect(() => {
    console.log('gameId', gameId);
    console.log('userId', userId);
    console.log('getting hand');
  }, []);

  return (
    <div className="card-area">
      <div className="output">{output}</div>

      <div className="player-area">
        <div
          className="opp opp-left"
          style={{ border: "1px dotted darkred" }}
          onClick={e => {
            console.log("expand");
          }}
        >
          {hand.map(card => {
            return card.render();
          })}
        </div>
        <div
          className="opp opp-center"
          style={{ border: "1px dotted darkgreen" }}
        >
          cards
        </div>
        <div
          className="opp opp-right"
          style={{ border: "1px dotted darkblue" }}
        >
          cards
        </div>
      </div>

      <div
        className="deck"
        onClick={e => {
          axios.get(`${api}/draw/?userId=${userId}`).then(res => {
            console.log(res);
            const card = new Card(res.data.card.suit, res.data.card.value);
            console.log(card);
            setHand([...hand, card]);
            setOutput("you drew " + card.toString());
          });
        }}
      >
        <div className="draw-button">Draw</div>
      </div>
      <div
        className="discard"
        onClick={e => {
          console.log("discard");
          console.log(discard.shift().toString());
        }}
      >
        &nbsp;
      </div>

      <div className="player-area">
        <div
          className="player"
          onClick={e => {
            console.log("clicked", selected);
            if (selected.length > 0) {
              let newPlayed = [...played, ...selected.map(i => hand[i])];
              let newHand = hand.filter((card, i) => !selected.includes(i));

              setPlayed(newPlayed);
              setHand(newHand);
              setSelected([]);
            }
          }}
        >
          {played.map(card => {
            return card.render();
          })}
        </div>
      </div>

      <div
        className="hand-area"
        onMouseDown={e => {
          console.log(e.target);
        }}
      >
        {hand.map((card, i) => {
          return card.render(
            {
              onClick: e => {
                const index = selected.indexOf(i);
                if (index === -1) {
                  setSelected([...selected, i]);
                } else {
                  const newSelected = [...selected];
                  newSelected.splice(index, 1);
                  setSelected(newSelected);
                }
              }
            },
            { isSelected: selected.includes(i) }
          );
        })}
      </div>
    </div>
  );
};
export default CardArea;
