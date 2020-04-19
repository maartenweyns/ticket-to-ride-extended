var indexRouter = require('./routes/index');

var createError = require('http-errors');
var express = require('express');
var websocket = require("ws");
var messages = require("./public/javascripts/messages");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require("http");
var Player = require('./player');
var Game = require("./game");

var port = process.argv[2];
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use('/', indexRouter);

var server = http.createServer(app);
const wss = new websocket.Server({server});

var connectionID = 0;
var playerList = {};

var playerColors = ["yellow", "red", "purple", "green", "blue"];

var game = new Game();

wss.on("connection", function connection(ws) {
  if (connectionID === 0){
    game.setOpenCards();
  }
  let con = ws;
  con.id = connectionID++;

  console.log("A player has joined the game");

  // Send the player number to the player.
  let msg1 = messages.O_PLAYER_NAME;
  msg1.data = con.id;
  con.send(JSON.stringify(msg1));
  game["player" + con.id] = new Player("A name", "black", con);

  // Send the open cards to the player that just connected.
  let msg2 = messages.O_OPEN_CARDS;
  msg2.data = game.getOpenCards();
  con.send(JSON.stringify(msg2));

  con.on("message", function incoming(message) {
    let oMsg = JSON.parse(message);
    console.log("message from " + con.id + ": " + oMsg.data);

    if (oMsg.type === messages.T_PLAYER_TOOK_OPEN_TRAIN) {
      console.log("A player took " + oMsg.data);
      var color = game.getRandomColor();
      game.openCards[oMsg.data] = color;

      let msg = messages.O_NEW_OPEN_CARD;
      msg.data = {repCard: oMsg.data, newColor: color};
      game.sendToAll(msg);
    }

  });

  con.on("close", function (code) {

  });
});

server.listen(port);

module.exports = app;
