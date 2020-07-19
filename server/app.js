const hostname = "localhost";
const port = 6969;

const net = require("net");

let sockets = [];
let server = net.createServer();

class GameObject {
  constructor() {
    this.id = Date.now().toString();
    this.players = {};
    this.table = ["", "", "", ""];
    this.turn = 0;
  }

  register_player(uid, socket) {
    this.players[uid] = socket;
    let idx = this.table.indexOf("");
    if (idx < 4) {
      this.table[idx] = uid;
    } else {
      console.log(uid + " is just watching.");
    }
  }
}

const gameObject = new GameObject();

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
    if (data.action == "identify") {
      console.log("hello, " + data.uid + "!");
      socket.write(data.uid + "\n");
      gameObject.register_player(data.uid, socket);
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
