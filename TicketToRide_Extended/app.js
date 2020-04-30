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

const ShortUniqueId = require('short-unique-id').default;

// instantiate uid
const uid = new ShortUniqueId();

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
var websockets = [];
var playerColors = ["yellow", "lightblue", "grey", "purple", "red", "green", "brightyellow", "blue"];

var game = new Game(uid.randomUUID(8));

wss.on("connection", function connection(ws) {
    let con = ws;
    con.id = connectionID++;
    websockets[con.id] = ws;

    console.log("A player has joined the game.");

    // Send the player number to the player.
    let msg1 = messages.O_PLAYER_NAME;
    msg1.data = {pid: con.id, gid: game.gameID};
    con.send(JSON.stringify(msg1));

    // Send the open cards to the player that just connected.
    let msg2 = messages.O_OPEN_CARDS;
    msg2.data = {cards: game.getOpenCards(), shuffle: false};
    con.send(JSON.stringify(msg2));

    con.on("message", function incoming(message) {
        let oMsg = JSON.parse(message);

        if (oMsg.type === messages.T_PLAYER_NAME) {
            let pid = oMsg.data.pID;

            if (game.gameState !== "lobby") {
                let msg = messages.O_LOBBY;
                websockets[pid].send(JSON.stringify(msg));
                return;
            }

            game["player" + pid] = new Player(pid, oMsg.data.pName, playerColors.pop(), websockets[pid]);

            game.amountOfPlayers++;

            let msg1 = messages.O_PLAYER_OVERVIEW;
            msg1.data = game.getUserProperties();
            game.sendToAll(msg1);
        }

        if (oMsg.type === messages.T_PLAYER_EXISTING_ID) {
            if (game.gameID !== oMsg.data.gid) {
                console.log("A player joined the wrong game.");
                let msg = messages.O_LOBBY;
                websockets[oMsg.data.conId].send(JSON.stringify(msg));
                return;
            }
            let pid = oMsg.data.pid;
            game["player" + pid].updatewebsocket(websockets[oMsg.data.conId]);
            console.log("User " + pid + " updated his websocket connection.");

            let msg1 = messages.O_PLAYER_OVERVIEW;
            msg1.data = game.getUserProperties();
            game.sendToAll(msg1);

            let color1 = game.getRandomColor();
            let color2 = game.getRandomColor();
            let color3 = game.getRandomColor();
            let color4 = game.getRandomColor();

            let msg3 = messages.O_INITIAL_CARDS;
            msg3.data = {desti: {0: game.getEuDestination(), 1: game.getEuDestination(), 2: game.getUsDestination(), 3: game.getUsDestination()}}
            game["player" + pid].sendMessage(msg3);
            game["player" + pid][color1]++;
            game["player" + pid][color2]++;
            game["player" + pid][color3]++;
            game["player" + pid][color4]++;
            game["player" + pid].numberOfTrainCards += 4;

            game.sendPersonalCardsToUser(pid);
        }

        if (oMsg.type === messages.T_GAME_START) {
            game.gameState = "choosing-tickets";

            let msg = messages.O_GAME_START;
            game.sendToAll(msg);
        }

        if (oMsg.type === messages.T_PLAYER_TOOK_OPEN_TRAIN) {
            let pid = oMsg.data.pid;
            console.log("Player " + pid + " took " + oMsg.data.card);

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

            game["player" + pid].numberOfTrainCards++;
            game["player" + pid][oMsg.data.color]++;

            if (oldColor === "loco") {
                game["player" + pid][game.getRandomColor()]++;
                game["player" + pid].numberOfTrainCards++;
                game.nextPlayerRound();
            } else {
                game.playerDidSomething();
            }

            let msgPlayers = messages.O_PLAYER_OVERVIEW;
            msgPlayers.data = game.getUserProperties();
            game.sendToAll(msgPlayers);

            game.sendPersonalCardsToUser(pid);

            game.sendPlayerRound();
        }

        if (oMsg.type === messages.T_REQUEST_TRAIN) {
            let pid = oMsg.data;
            console.log("Player " + oMsg.data + " requested a closed train.");
            let color = game.getRandomColor();

            let msgCard = messages.O_REQUEST_TRAIN;
            msgCard.data = color;
            game["player" + pid].sendMessage(msgCard);

            game["player" + pid].numberOfTrainCards++;
            game["player" + pid][color]++;

            let msgPlayers = messages.O_PLAYER_OVERVIEW;
            msgPlayers.data = game.getUserProperties();
            game.sendToAll(msgPlayers);

            let msgMove = messages.O_PLAYER_CLOSED_MOVE;
            msgMove.data = {pid: pid, move: "TRAIN-CARD"}
            game.sendToAll(msgMove);

            game.playerDidSomething();

            game.sendPersonalCardsToUser(pid);

            game.sendPlayerRound();
        }

        if (oMsg.type === messages.T_ROUTE_CLAIM) {
            let pid = oMsg.data.pid;
            console.log("A user requested a route: " + oMsg.data.continent + "-" + oMsg.data.route);
            let ret = game.checkEligibility(oMsg.data.pid, oMsg.data.color, oMsg.data.route, oMsg.data.continent);
            let msg = messages.O_ROUTE_CLAIM;

            if (ret.status) {
                msg.data = {status: true, pid: oMsg.data.pid, route: oMsg.data.route, pcol: game["player" + oMsg.data.pid].color,
                color: ret.color, continent: oMsg.data.continent};
                game.sendToAll(msg);
                game["player" + oMsg.data.pid][oMsg.data.color] -= ret.amount;
                game["player" + oMsg.data.pid].loco -= ret.locos;
                game["player" + oMsg.data.pid].numberOfTrains -= game.getRouteRequirements(oMsg.data.route, oMsg.data.continent).length;
                game["player" + oMsg.data.pid].numberOfTrainCards -= game.getRouteRequirements(oMsg.data.route, oMsg.data.continent).length;
                let msgPlayers = messages.O_PLAYER_OVERVIEW;
                msgPlayers.data = game.getUserProperties();
                game.sendToAll(msgPlayers);
                
                let routeMap = oMsg.data.continent + "Routes";
                game.userClaimedRoute(oMsg.data.pid, game[routeMap].get(oMsg.data.route));

                game.sendPersonalCardsToUser(pid);

                game.playerPutRoute();
                game.sendPlayerRound();
            } else {
                msg.data = {pid: oMsg.data.pid, status: false};
                game["player" + oMsg.data.pid].sendMessage(msg);
            }
        }

        if (oMsg.type === messages.T_PLAYER_TOOK_DESTINATION) {
            let msg = messages.O_PLAYER_TOOK_DESTINATION;
            let random = Math.random();
            if (random < 0.5) {
                msg.data = {0: game.getEuDestination(), 1: game.getUsDestination(), 2: game.getUsDestination()};
            } else {
                msg.data = {0: game.getEuDestination(), 1: game.getEuDestination(), 2: game.getUsDestination()};
            }
            game["player" + oMsg.data].sendMessage(msg);

            let msgMove = messages.O_PLAYER_CLOSED_MOVE;
            msgMove.data = {pid: oMsg.data, move: "ROUTE-CARD"}
            game.sendToAll(msgMove);
        }

        if (oMsg.type === messages.T_ACCEPTED_DESTI) {
            let pid = oMsg.data.pid;
            let routeID = oMsg.data.rid.split("-");
            continent = routeID[0];
            destinationMap = continent + "Desti";
            

            game["player" + pid].destinations.push(game[destinationMap].get(routeID[1] + "-" + routeID[2]));
            game["player" + pid].numberOfRoutes++;

            game.checkContinuity(pid);

            if (game.gameState === "choosing-tickets") {
                console.log("A player is now ready.")
                game["player" + pid].ready = true;
    
                if (game.allPlayersReady()) {
                    game.currentRound = Math.ceil(Math.random() * game.amountOfPlayers) - 1;
    
                    game.sendPlayerRound();

                    console.log("The game has now started!");
                    game.gameState = "ongoing";
                }
            }

            let msgPlayers = messages.O_PLAYER_OVERVIEW;
            msgPlayers.data = game.getUserProperties();
            game.sendToAll(msgPlayers);
        }

        if (oMsg.type === messages.T_REJECTED_DESTI) {
            let routeID = oMsg.data.split("-");
            continent = routeID[0];
            destinationMap = continent + "Desti";
            game.euStack.push([routeID[1] + "-" + routeID[2], game[destinationMap].get(routeID[1] + "-" + routeID[2])]);
            game.shuffleDestis();

            console.log("A player rejected a route and the deck has been shuffled");
        }

        if (oMsg.type === messages.T_PLAYER_FINISHED) {
            if (game.gameState === "ongoing") {
                game.nextPlayerRound();
                game.sendPlayerRound();
            }
        }
    });

    con.on("close", function (code) {

    });
});

server.listen(port);

module.exports = app;
