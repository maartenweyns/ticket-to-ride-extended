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

wss.on("connection", function connection(ws) {
  let con = ws;
  con.id = connectionID++;

  console.log("A player has joined the game");

  con.send(messages.S_PLAYER_NAME);

  con.on("message", function incoming(message) {
    console.log("message from " + con.id);
    let oMsg = JSON.parse(message);

    if (oMsg.type === messages.T_PLAYER_NAME) {
      console.log("player with the name " + oMsg.data + " has joined!");
      playerList[con.id] = new Player(oMsg.data, playerColors.pop(), con);

      for (let i = 0; i < connectionID; i++) {
        playerList[i].sendMessage(msg);
      }

    }

  });

  con.on("close", function (code) {

  });
});

server.listen(port);

module.exports = app;
