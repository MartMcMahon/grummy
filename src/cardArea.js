import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "./cards";
import { useGameObject } from "./gameObject";
import "./cardArea.scss";

let api_root = "https://grummy.mart.pizza:8080";
if (process.env.NODE_ENV === "development") {
  api_root = "http://localhost:6969";
}

const CardArea = props => {
  let [gameId, setGameId] = useState("0");
  let [chair, setChair] = useState(0);
  let [hand, setHand] = useState([]);
  let [table, setTable] = useState([[], [], [], []]);
  let [discard, setDiscard] = useState([]);
  let [selected, setSelected] = useState([]);
  let [selectedDiscard, setSelectedDiscard] = useState(-1);
  let userId = props.userId;

  // actions
  const drawAction = event => {
    console.log("draw");
    axios.get(`${api_root}/draw/?userId=${userId}`).then(res => {
      const newHand = res.data.hand.map(base_card => new Card(base_card));
      setHand(newHand);
    });
  };

  const playAction = event => {
    if (selected.length > 0) {
      axios
        .put(
          `${api_root}/play_cards?userId=${userId}&cards=${JSON.stringify(
            selected
          )}`
        )
        .then(res => {
          console.log("play res", res);
        });
      setSelected([]);
    }
  };

  const discardAction = event => {
    if (selected.length === 1) {
      axios
        .put(`${api_root}/discard?userId=${userId}&index=${selected[0]}`)
        .then(res => {
          console.log("discard res", res);
          setSelected([]);
        });
    } else if (selected.length > 1) {
      alert("that's too many");
    } else {
      return true;
    }
  };

  // effects
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
        const new_table = res.data.table.map((played_cards, i) =>
          res.data.table[(i + chair) % 4].map(card => new Card(card))
        );
        setTable(new_table);
        setHand(res.data.hand.map(card => new Card(card)));
        setDiscard(res.data.discard.map(card => new Card(card)));
        // setTurn(res.data.turn);
        // setPhase(res.data.phase);
      });
    }, 2000);
    return () => {
      clearInterval(game_pinger);
    };
  }, [chair, userId, selected, selectedDiscard ]);

  return (
    <div className="card-area">
      <div className="top-area">
        <div className="opponent top-opponent">
          {table[1].map(card => {
            return card.render();
          })}
          top opponent
        </div>
        <div className="opponent left-opponent">
          {table[2].map(card => {
            return card.render();
          })}
          left opponent
        </div>
        <div className="opponent right-opponent">
          {table[3].map(card => {
            return card.render();
          })}
          right opponent
        </div>
      </div>
      <div className="draw-discard-area">
        <div className="card-button deck" onClick={drawAction}>
          draw
        </div>
        <div className="card-button discard">
          {discard.map((card, i) => {
            return (
              <div
                className={`discard-card${
                  i === selectedDiscard ? " selected" : ""
                }`}
                onClick={e => {
                  setSelected([]);
                  if (i === selectedDiscard) {
                    setSelectedDiscard(-1);
                  } else {
                    setSelectedDiscard(i);
                  }
                }}
              >
                {card.render()}
              </div>
            );
          })}
        </div>
          {selectedDiscard > -1 && (
          <div className="button card-button draw-from-pile-button">pickup</div>
        )}
        {selected.length > 0 && (
          <div
            className="button card-button play-card-button"
            onClick={playAction}
          >
            play
          </div>
        )}
        {selected.length === 1 && (
          <div
            className="button card-button discard-card-button"
            onClick={discardAction}
          >
            discard
          </div>
        )}
      </div>
      <div className="player play-area">
        {table[0].map(card => {
          return card.render();
        })}
      </div>
      <div className="player hand">
        your hand
        {hand.map((card, i) => {
          return card.render(
            {
              onClick: e => {
                setSelectedDiscard(-1);
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
