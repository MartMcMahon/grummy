import React, { useEffect, useState } from "react";
import firebase from "./firebase";
import { Card, Deck } from "./cards";
import axios from "axios";

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

  useEffect(() => {
    firebase
      .firestore()
      .collection("games")
      .onSnapshot(snapshot => {
        // const currentGame = Math.max(...snapshot.docs.map(doc => parseInt(doc.id)));
        const currentGame = snapshot.docs
          .map(doc => doc.id)
          .sort()
          .reverse()[0];
        setGameId(currentGame);
      });
  }, [gameId]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("games")
      .doc(gameId)
      .collection("turns")
      .onSnapshot(snapshot => {
        setTurnCount(snapshot.docs.length);
      });
  }, [gameId]);

  const newGameOnClick = e => {
    axios.get(`${api}/new`).then(res => {
      console.log("cool", res);
    });
  };

  const endTurnOnClick = e => {
    firebase
      .firestore()
      .collection("games")
      .doc(gameId)
      .collection("turns")
      .add({ ok: "cool" });
  };

  return (
    <div className="card-area">
      <div className="new-game-button" onClick={newGameOnClick}>
        new game (current: {gameId})
      </div>
      <div className="test-end-turn-button" onClick={endTurnOnClick}>
        end turn ({turnCount})
      </div>
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
          axios.get(`${api}/draw?UUID=${window.localStorage.getItem("UUID")}`).then(res => {
            const card = new Card(res.data.card);
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
