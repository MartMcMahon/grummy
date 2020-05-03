import React, { useEffect, useState } from "react";
import axios from "axios";
import firebase from "./firebase";
import { Card, Deck } from "./cards";
import querystring from "querystring";

const api = "http://localhost:6969";

const CardArea = props => {
  let [gameId, setGameId] = useState("0");
  // let [gameData, setGameData] = useState({});
  // let [turnCount, setTurnCount] = useState(0);
  // let [currentTurn, setCurrentTurn] = useState(0);

  let [hand, setHand] = useState([]);
  let [selected, setSelected] = useState([]);
  let [played, setPlayed] = useState([]);
  let [discard, setDiscard] = useState([]);
  let [table, setTable] = useState([[], [], [], []]);

  let [output, setOutput] = useState("");

  let userId = props.userId;

  useEffect(() => {
    axios
      .get(`${api}/game_status`)
      .then(res => {
        console.log("cool", res.data.id);
        setGameId(res.data.id);
      })
      .then(() => {
        return axios.put(`${api}/register_player?userId=${userId}`);
      })
      .then(chair => {
        console.log("chair", chair);
      });
  }, [gameId]);

  // useEffect(() => {
  //   axios.get(`${api}/table`).then(res => {
  //     setTable(res);
  //   });
  // }, [table]);

  useEffect(() => {
    console.log("gameId", gameId);
    console.log("userId", userId);
    console.log("table", table);
  }, [gameId]);

  const playCards = e => {
    if (selected.length > 0) {
      const cards = [];
      selected.forEach(i => {
        cards.push(hand[i]);
      });
      console.log('pushing ', JSON.stringify(cards));

      axios
        .put(
          `${api}/play_cards?userId=${userId}&cards=${JSON.stringify(cards)}`
        )
        .then(res => {
          console.log("play res", res);
        });
      // get new hand and new play area from resopnse
      setSelected([]);
    }
  };

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
          cards player 1{/* {table[1].map(card => { */}
          {/*   return card.render(); */}
          {/* })} */}
        </div>
        <div
          className="opp opp-center"
          style={{ border: "1px dotted darkgreen" }}
        >
          cards player 2{/* {table[2].map(card => { */}
          {/*   return card.render(); */}
          {/* })} */}
        </div>
        <div
          className="opp opp-right"
          style={{ border: "1px dotted darkblue" }}
        >
          cards player 2{/* {table[3].map(card => { */}
          {/*   return card.render(); */}
          {/* })} */}
        </div>
      </div>

      <div
        className="deck"
        onClick={e => {
          axios.get(`${api}/draw/?userId=${userId}`).then(res => {
            const newHand = res.data.hand.map(base_card => new Card(base_card));
            setHand(newHand);
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
        <div className="player" onClick={playCards}>
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
