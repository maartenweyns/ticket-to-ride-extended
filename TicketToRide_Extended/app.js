var indexRouter = require('./routes/index');

var express = require('express');
var websocket = require("ws");
var messages = require("./public/javascripts/messages");
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require("http");
var Player = require('./player');
var Route = require('./route');
var Game = require("./game");

var port = process.argv[2];
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use('/', indexRouter);

var server = http.createServer(app);
const wss = new websocket.Server({server});

var connectionID = 0;
var websockets = {};
var playerColors = ["yellow", "red", "purple", "green", "blue", "yellow", "red", "purple", "green", "blue"];

var game = new Game();
game.setupEuRoutes();

wss.on("connection", function connection(ws) {
    if (connectionID === 0) {
        game.setOpenCards();
    }
    let con = ws;
    con.id = connectionID++;
    websockets[con.id] = ws;

    console.log("A player has joined the game");

    // Send the player number to the player.
    let msg1 = messages.O_PLAYER_NAME;
    msg1.data = con.id;
    con.send(JSON.stringify(msg1));

    // Send the open cards to the player that just connected.
    let msg2 = messages.O_OPEN_CARDS;
    msg2.data = {cards: game.getOpenCards(), shuffle: false};
    con.send(JSON.stringify(msg2));

    con.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);
        console.log("message from " + con.id + ": " + oMsg.data);

        if (oMsg.type === messages.T_PLAYER_NAME) {
            let pid = oMsg.data.pID;
            game["player" + pid] = new Player(oMsg.data.pName, playerColors.pop(), websockets[pid]);

            let msg = messages.O_PLAYER_OVERVIEW;
            msg.data = game.getUserProperties();
            game.sendToAll(msg);
        }

        if (oMsg.type === messages.T_PLAYER_TOOK_OPEN_TRAIN) {
            console.log("Player " + oMsg.data.pid + " took " + oMsg.data.card);
            let color = game.getRandomColor();
            game.openCards[oMsg.data.card] = color;

            let msg = messages.O_NEW_OPEN_CARD;
            msg.data = {repCard: oMsg.data.card, newColor: color};
            game.sendToAll(msg);

            if (game.checkNeedForShuffle()) {
                let msg = messages.O_OPEN_CARDS;
                game.setOpenCards();
                msg.data = {cards: game.getOpenCards(), shuffle: true};
                game.sendToAll(msg);
            }

            game["player" + oMsg.data.pid].numberOfTrainCards++;
            game["player" + oMsg.data.pid][oMsg.data.color]++;

            let msgPlayers = messages.O_PLAYER_OVERVIEW;
            msgPlayers.data = game.getUserProperties();
            game.sendToAll(msgPlayers);
        }

        if (oMsg.type === messages.T_REQUEST_TRAIN) {
            console.log("Player " + oMsg.data + " requested a closed train.");
            let color = game.getRandomColor();

            let msgCard = messages.O_REQUEST_TRAIN;
            msgCard.data = color;
            game["player" + oMsg.data].sendMessage(msgCard);

            game["player" + oMsg.data].numberOfTrainCards++;
            game["player" + oMsg.data][color] += 1;

            let msgPlayers = messages.O_PLAYER_OVERVIEW;
            msgPlayers.data = game.getUserProperties();
            game.sendToAll(msgPlayers);
        }

        if (oMsg.type === messages.T_ROUTE_REQ) {
            console.log("Player requests route info on " + oMsg.data.route);
            let ret = game.getRouteRequirements(oMsg.data.route);
            let msg = messages.O_ROUTE_REQ;
            msg.data = ret;
            game["player" + oMsg.data.pid].sendMessage(msg);
        }

        if (oMsg.type === messages.T_ROUTE_CLAIM) {
            console.log("A user requested a route");
            let ret = game.checkEligibility(oMsg.data.pid, oMsg.data.color, oMsg.data.route);
            let msg = messages.O_ROUTE_CLAIM;

            if (ret.status) {
                msg.data = {status: true, pid: oMsg.data.pid, route: oMsg.data.route, pcol: game["player" + oMsg.data.pid].color,
                color: ret.color, amount: ret.amount, locos: ret.locos};
                game.sendToAll(msg);
                game["player" + oMsg.data.pid][oMsg.data.color] -= ret.amount;
                game["player" + oMsg.data.pid].loco -= ret.locos;
                game["player" + oMsg.data.pid].numberOfTrains -= game.getRouteRequirements(oMsg.data.route).length;
                game["player" + oMsg.data.pid].numberOfTrainCards -= game.getRouteRequirements(oMsg.data.route).length;
                let msgPlayers = messages.O_PLAYER_OVERVIEW;
                msgPlayers.data = game.getUserProperties();
                game.sendToAll(msgPlayers);
            } else {
                msg.data = {pid: oMsg.data.pid, status: false};
                game["player" + oMsg.data.pid].sendMessage(msg);
            }
        }
    });

    con.on("close", function (code) {

    });
});

server.listen(port);

module.exports = app;
