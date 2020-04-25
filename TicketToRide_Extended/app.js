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
var playerColors = ["yellow", "lightblue", "grey", "purple", "red", "green", "brightyellow", "blue"];

var game = new Game();

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
            game["player" + pid] = new Player(pid, oMsg.data.pName, playerColors.pop(), websockets[pid]);

            let msg1 = messages.O_PLAYER_OVERVIEW;
            msg1.data = game.getUserProperties();
            game.sendToAll(msg1);
        }

        if (oMsg.type === messages.T_PLAYER_EXISTING_ID) {
            let pid = oMsg.data.pid;
            game["player" + pid].updatewebsocket(websockets[oMsg.data.conId]);
            console.log("User " + pid + " updated his websocket connection.");

            let msg1 = messages.O_PLAYER_OVERVIEW;
            msg1.data = game.getUserProperties();
            game.sendToAll(msg1);

            let msg2 = messages.O_PLAYER_ROUND;
            msg2.data = {pid: game.currentRound, thing: game.thingsDone};
            game.sendToAll(msg2);
        }

        if (oMsg.type === messages.T_GAME_START) {
            let msg = messages.O_GAME_START;
            game.sendToAll(msg);
        }

        if (oMsg.type === messages.T_PLAYER_TOOK_OPEN_TRAIN) {
            console.log("Player " + oMsg.data.pid + " took " + oMsg.data.card);

            let color = game.getRandomColor();
            let oldColor = game.openCards[oMsg.data.card];
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

            if (oldColor === "loco") {
                let msg = messages.O_REQUEST_TRAIN;
                msg.data = game.getRandomColor();
                game["player" + oMsg.data.pid].sendMessage(msg);
                game.nextPlayerRound();
            } else {
                game.playerDidSomething();
            }
            let msg2 = messages.O_PLAYER_ROUND;
            msg2.data = {pid: game.currentRound, thing: game.thingsDone};
            game.sendToAll(msg2);
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

            let msgMove = messages.O_PLAYER_CLOSED_MOVE;
            msgMove.data = {pid: oMsg.data, move: "TRAIN-CARD"}
            game.sendToAll(msgMove);

            game.playerDidSomething();

            let msg2 = messages.O_PLAYER_ROUND;
            msg2.data = {pid: game.currentRound, thing: game.thingsDone};
            game.sendToAll(msg2);
        }

        if (oMsg.type === messages.T_ROUTE_REQ) {
            console.log("Player requests route info on " + oMsg.data.route);
            let ret = game.getRouteRequirements(oMsg.data.route);
            let msg = messages.O_ROUTE_REQ;
            msg.data = ret;
            game["player" + oMsg.data.pid].sendMessage(msg);

            let msgMove = messages.O_PLAYER_CLOSED_MOVE;
            msgMove.data = {pid: oMsg.data, move: "ROUTE-CARD"}
            game.sendToAll(msgMove);
        }

        if (oMsg.type === messages.T_ROUTE_CLAIM) {
            console.log("A user requested a route: " + oMsg.data.route);
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

                game.userClaimedRoute(oMsg.data.pid, game.euRoutes.get(oMsg.data.route));

                game.nextPlayerRound();

                let msg2 = messages.O_PLAYER_ROUND;
                msg2.data = {pid: game.currentRound, thing: game.thingsDone};
                game.sendToAll(msg2);
            } else {
                msg.data = {pid: oMsg.data.pid, status: false};
                game["player" + oMsg.data.pid].sendMessage(msg);
            }
        }

        if (oMsg.type === messages.T_PLAYER_TOOK_DESTINATION) {
            let msg = messages.O_PLAYER_TOOK_DESTINATION;
            msg.data = {0: game.getEuDestination(), 1: game.getEuDestination(), 2: game.getEuDestination()};
            game["player" + oMsg.data].sendMessage(msg);
        }

        if (oMsg.type === messages.T_ACCEPTED_DESTI) {
            let pid = oMsg.data.pid;
            let routeID = oMsg.data.rid;
            game["player" + pid].destinations.push(game.euDesti.get(routeID));
        }

        if (oMsg.type === messages.T_REJECTED_DESTI) {
            let destID = oMsg.data;
            game.euStack.push([destID, game.euDesti.get(destID)]);
            game.shuffleDestis();

            console.log("A player rejected " + destID + " and the deck has been shuffled");
        }
    });

    con.on("close", function (code) {

    });
});

server.listen(port);

module.exports = app;
