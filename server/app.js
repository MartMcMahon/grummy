const hostname = "localhost";
const port = 6969;

const net = require("net");

let sockets = [];
let server = net.createServer();
let { Card, Deck, Discard } = require("./cards");

class GameObject {
  constructor() {
    this.id = Date.now().toString();
    this.players = {};
    this.hands = {};
    this.seats = ["", "", "", ""];
    this.turn = 0;
    this.deck = new Deck();
    this.deck.shuffle();
    this.discard = new Discard();
  }

  testMode() {
    this.seats = ["20", "69", "420", "666"];
    this.turn = 1;
    this.phase = 1;
    this.hands = {
      "20": [
        this.deck.draw(),
        this.deck.draw(),
        this.deck.draw(),
        this.deck.draw(),
        this.deck.draw()
      ],
      "69": [this.deck.draw(), this.deck.draw(), this.deck.draw()],
      "420": [this.deck.draw(), this.deck.draw()],
      "666": []
    };
    this.played = [];
    this.player_status = {};
  }

  register_player(uid, socket) {
    this.players[uid] = socket;
    let idx = this.seats.indexOf("");
    if (idx < 4) {
      this.seats[idx] = uid;
    } else {
      console.log(uid + " is just watching.");
    }
  }

  deal_card(uid) {

  }
}

const gameObject = new GameObject();
// test mode
gameObject.testMode();

server.on("connection", socket => {
  console.log("someone connected");
  socket.setEncoding("utf8");
  socket.index = sockets.length;
  sockets.push(socket);

  socket.on("ready", x => {
    console.log("ready", x);
  });

  socket.on("data", data => {
    data = JSON.parse(data);
    console.log(data);
    if (data.action === "ping") {
      console.log(`getting pinged`);
      socket.write(JSON.stringify({ seats: gameObject.seats }) + "\n");
    } else if (data.action == "identify") {
      console.log("hello, " + data.uid + "!");
      gameObject.register_player(data.uid, socket);
      socket.write(
        JSON.stringify({ id: data.uid, seats: gameObject.seats }) + "\n"
      );
      // } else if () {
    } else if (data.action === "sync") {
      console.log("syncing with ", data.id);
      gameObject.player_status[data.id] = true;
      all_synced = true;
      Object.entries(gameObject.player_status).forEach(([player, status]) => {
        all_synced = all_synced && status;
      });
      if (all_synced) {
        console.log("all_synced");
      } else {
        console.log("not all ");
      }

      let output_data = {
        seats: gameObject.seats,
        turn: gameObject.turn,
        phase: gameObject.phase
      };
      socket.write(JSON.stringify(output_data) + "\n");
    }
  });

  socket.on("end", () => {
    console.log("disconnected");
  });

  socket.on("error", err => {
    console.log("an error happened", err);
  });
});

// setInterval(() => {
//   sockets.forEach((socket,i) => {
//     console.log(i, socket.index);
//     socket.write('hello, ' + i + '!');
//   });
// }, 1000);

server.listen(6969);
