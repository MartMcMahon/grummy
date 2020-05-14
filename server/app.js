const hostname = "127.0.0.1";
const port = 6969;

let admin = require("firebase-admin");
let serviceAccount = require("./grummy-4db97-firebase-adminsdk-pfho9-60fcb53f5e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grummy-4db97.firebaseio.com"
});

const express = require("express");
const cors = require("cors");
const app = express();

const { Card } = require("./cards");
const GameObject = require("./gameObject");
let gameObject = null;

app.use(cors());
app.get("/", (req, res) => {
  let db = admin.database();
  let ref = db.ref("games/");

  let val;
  // Attach an asynchronous callback to read the data at our posts reference
  ref.on(
    "value",
    function(snapshot) {
      val = snapshot.val();
      console.log(snapshot.val());
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );
  res.send(val);
});

app.get("/draw", (req, res) => {
  const userId = req.query.userId;
  const hand = gameObject.deal(userId);
  res.send({ hand });
});

app.get("/game_status", (req, res) => {
  let gameId;
  if (gameObject) {
    gameId = gameObject.id;
  } else {
    gameObject = new GameObject.GameObject();
    gameObject.startRound();
    gameId = gameObject.id;
  }
  res.send({ id: gameId });
  return gameId;
});

app.put("/play_cards", (req, res) => {
  const userId = req.query.userId;
  const cards = JSON.parse(req.query.cards);
  // .map(
  // base_card => new Card(base_card)
  // );
  console.log(gameObject);
  const new_state = gameObject.playCards(userId, cards);
  res.send(new_state);
});

app.put("/discard", (req, res) => {
  const userId = req.query.userId;
  const index = req.query.index;
  const new_state = gameObject.discardCard(userId, index);
  res.send(new_state);
});

app.put("/register_player", (req, res) => {
  let userId = req.query.userId;
  let response = {};
  const chair = gameObject.registerPlayer(userId);
  response.chair = chair;
  switch (chair) {
    case "taken":
      ressponse.statusCode = 409;
      response.statusText = "username taken";
      break;
    case -1:
      response.statusCode = 409;
      response.statusText = "game is full";
      break;
    default:
      response.statusCode = 200;
      response.statusText = "registered";
  }
  res.send(response);
});

app.get("/state", (req, res) => {
  if (!gameObject) {
    res.send({ statusCode: 500 });
  }
  const response = {
    table: gameObject.table,
    discard: gameObject.discard,
    turn: gameObject.turn,
    phase: gameObject.phase
  };
  if (req.query.userId) {
    response["hand"] = gameObject.hands[req.query.userId];
  }
  res.send(response);
});

app.listen(port);
