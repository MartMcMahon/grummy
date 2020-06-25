const hostname = "localhost";
const port = 6969;

const net = require("net");

let sockets = [];
let server = net.createServer();

server.on("connection", socket => {
  console.log("someone connected");
  socket.setEncoding("utf8");
  sockets.push(socket);
  socket.on('data', data => {
    console.log(data);
    let clients = sockets.length;
    for ( let i = 0; i < clients; i++) {
      sockets[i].write(data);
    }
  });

});

server.listen(6969);
