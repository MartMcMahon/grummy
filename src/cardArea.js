import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "./cards";

let api_root = "https://grummy.mart.pizza:8080";
if (process.env.NODE_ENV === "development") {
  api_root = "http://localhost:6969";
}


const CardArea = props => {
  let [gameId, setGameId] = useState("0");
  let [chair, setChair] = useState(0);
  let [hand, setHand] = useState([]);
  let [selected, setSelected] = useState([]);
  let [discard, setDiscard] = useState([]);
  let [selectedDiscard, setSelectedDiscard] = useState(-1);
  let [table, setTable] = useState([[], [], [], []]);
  let [output, setOutput] = useState("");
  let [turn, setTurn] = useState(-1);
  let [phase, setPhase] = useState(-1);
  let [selectButton, setSelectButton] = useState(null);

  let userId = props.userId;

  useEffect(() => {
    const game_pinger = setInterval(() => {
      axios.get(`${api_root}/state?userId=${userId}`).then(res => {
        console.log("state request", res);
        const new_table = res.data.table.map((played_cards, i) =>
          res.data.table[(i + chair) % 4].map(card => new Card(card))
        );
        console.log("chair", chair);
        console.log("new table", new_table);
        setTable(new_table);
        setHand(res.data.hand.map(card => new Card(card)));
        setDiscard(res.data.discard.map(card => new Card(card)));
        setTurn(res.data.turn);
        setPhase(res.data.phase);
      });
    }, 2000);
    return () => {
      clearInterval(game_pinger);
    };
  }, [chair, userId]);

  useEffect(() => {
    axios
      .get(`${api_root}/game_status`)
      .then(res => {
        console.log("cool", res.data.id);
        setGameId(res.data.id);
      })
      .then(() => {
        axios.put(`${api_root}/register_player?userId=${userId}`).then(res => {
          console.log(res);
          setChair(res.data.chair);
        });
      });
  }, [gameId, userId]);

  useEffect(() => {
    let newOutput = "";
    if (turn === chair) {
      newOutput = "your turn";
    } else {
      newOutput = "";
    }
    setOutput(newOutput);
  }, [chair, turn, phase]);

  const playCards = e => {
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

  useEffect(() => {
    if (selected.length === 1) {
      setSelectButton(
        <div
          className="select-button"
          onClick={e => {
            if (selected.length === 1) {
              axios
                .put(
                  `${api_root}/discard?userId=${userId}&index=${selected[0]}`
                )
                .then(res => {
                  console.log("discard res", res);
                  setSelected([]);
                });
            } else if (selected.length > 1) {
              alert("that's too many");
            } else {
              return true;
            }
          }}
          role="button"
        >
          discard
        </div>
      );
    } else if (selectedDiscard !== -1) {
      setSelectButton(
        <div
          className="select-button"
          onClick={e => {
            console.log("drawing from the discard pile");
          }}
          role="button"
        >
          from discard
        </div>
      );
    } else {
      setSelectButton(null);
    }
  }, [chair, userId, selected, selectedDiscard ]);

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
          cards player 1
          {table[1].map(card => {
            return card.render();
          })}
        </div>
        <div
          className="opp opp-center"
          style={{ border: "1px dotted darkgreen" }}
        >
          cards player 2
          {table[2].map(card => {
            return card.render();
          })}
        </div>
        <div
          className="opp opp-right"
          style={{ border: "1px dotted darkblue" }}
        >
          cards player 3
          {table[3].map(card => {
            return card.render();
          })}
        </div>
      </div>

      <div
        className="deck"
        onClick={e => {
          axios.get(`${api_root}/draw/?userId=${userId}`).then(res => {
            const newHand = res.data.hand.map(base_card => new Card(base_card));
            setHand(newHand);
          });
        }}
      >
        <div className="draw-button">Draw</div>
      </div>
      <div className="discard-area">
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

      {selectButton}

      <div className="player-area">
        <div className="player" onClick={playCards}>
          {table[0].map(card => {
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
