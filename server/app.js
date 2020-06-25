const hostname = "127.0.0.1";
const port = 6969;

const express = require("express");
const cors = require("cors");
const https = require("https");
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  console.log("connected");
  res.send({"statusCode": 200, "body": "hello"});
});

app.listen(port);
