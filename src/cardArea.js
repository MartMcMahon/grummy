import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "./cards";

const api_root = "http://localhost:6969";

const CardArea = props => {
  let [gameId, setGameId] = useState("0");
  let [chair, setChair] = useState(0);
  let [hand, setHand] = useState([]);
  let [selected, setSelected] = useState([]);
  let [discard, setDiscard] = useState([]);
  let [selectedDiscard, setSelectedDiscard] = useState(-1);
  let [table, setTable] = useState([[], [], [], []]);
  let [output, setOutput] = useState("");

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

  const playCards = e => {
    if (selected.length > 0) {
      // const cards = [];
      // selected.forEach(i => {
      //   cards.push(hand[i]);
      // });
      // console.log("pushing ", JSON.stringify(cards));

      axios
        .put(
          `${api_root}/play_cards?userId=${userId}&cards=${JSON.stringify(
            selected
          )}`
        )
        .then(res => {
          console.log("play res", res);
          // setHand(res.data.new_hand.map(card => new Card(card)));
          // res.data.table.map(player_cards => {
          //   return player_cards.map(card => new Card(card));
          // });
        });
      setSelected([]);
    }
  };

  // const removeFromHand = cards => {
  //   const new_hand = hand.filter(
  //     card => !cards.includes(card)
  //   )
  //   setHand(new_hand);
  // }

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
      <div
        className="discard-area"
        onClick={e => {
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
        }}
      >
        {discard.map((card, i) => {
          return (
            <div
              className={`discard-card${
                i === selectedDiscard ? " selected" : ""
              }`}
              onClick={e => {
                console.log(card.suit, card.value);
                setSelectedDiscard(i);
              }}
            >
              {card.render()}
            </div>
          );
        })}
      </div>
      <div
        className="discard-button"
        onClick={e => {
          console.log(selected);
        }}
      ></div>
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
