var indexRouter = require('./routes/index');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require("http");
var Player = require('./player');
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
const io = require('socket.io')(server);

var connectionID = 0;
var playerColors = ["yellow", "lightblue", "grey", "purple", "red", "green", "brightyellow", "blue"];

var game = new Game(uid.randomUUID(8));
console.log('[START] Game started with ID ' + game.gameID);

io.on('connection', (socket) => {
    socket.on('player-name', (name) => {
        socket.join(game.gameID);
        socket.emit('information', {playerID: connectionID, gameID: game.gameID});
        game["player" + connectionID] = new Player(connectionID, name, playerColors.pop(), socket.id);
        console.log("[INFO] Player " + connectionID + " has been created: " + name + " with socketid " + socket.id);
        connectionID++;
        game.amountOfPlayers++;
        io.in(game.gameID).emit('player-overview', game.getUserProperties());
    });

    socket.on('start-game', (data) => {
        console.log('[STARTGAME] The game has been started by id ' + socket.id);
        game.gameState = 'routes';
        io.in(game.gameID).emit('start-game');
    });

    socket.on('player-ingame-join', (info) =>  {

        if (info.gameID !== game.gameID) {
            socket.emit('lobby');
            return;
        }

        // Put the socket in the game room
        socket.join(game.gameID);

        let pid = info.playerID;

        // Send open cards
        socket.emit('open-cards', {cards: game.getOpenCards(), shuffle: false});

        // Send player info
        socket.emit('player-overview', game.getUserProperties());

        console.log("[UPGRADE] Player " + pid + " updated his socketID to " + socket.id);
        game["player" + pid].socketID = socket.id;

        if (game.gameState === 'ongoing') {
            io.in(game.gameID).emit('player-round', game.getPlayerRound());
            socket.emit('own-cards', game.getPersonalCards(pid));
            socket.emit('own-destinations', {uncompleted: game["player" + pid].destinations, completed: game["player" + pid].completedDestinations});

            let trains = [];
            for(let i = 0; i < 8; i++) {
                if (game["player" + i] !== null) {
                    game["player" + i].routeIDs.forEach(element => trains.push([game["player" + i].color, element]));
                }
            }
            socket.emit('existing-trains', trains);
        }

        if (game.gameState === 'routes') {
            // Send own tickets
            let color1 = game.getRandomColor();
            let color2 = game.getRandomColor();
            let color3 = game.getRandomColor();
            let color4 = game.getRandomColor();
            game["player" + pid][color1]++;
            game["player" + pid][color2]++;
            game["player" + pid][color3]++;
            game["player" + pid][color4]++;
            game["player" + pid].numberOfTrainCards += 4;
            socket.emit('own-cards', game.getPersonalCards(pid));

            let routes;
            let longdesti = game.longStack.pop();
            if (longdesti[1].continent === "eu") {
                routes = {0: longdesti, 1: game.getEuDestination(), 2: game.getUsDestination(), 3: game.getUsDestination()}
            } else {
                routes = {0: game.getEuDestination(), 1: game.getEuDestination(), 2: longdesti, 3: game.getUsDestination()}
            }
            socket.emit('initial-routes', routes);
        }
    });

    socket.on('accepted-destination', (data) => {
        let pid = data.pid;
        let routeID = data.rid.split("-");
        continent = routeID[0];
        destinationMap = continent + "Desti";

        if (game[destinationMap].get(routeID[1] + "-" + routeID[2]) !== undefined) {
            game["player" + pid].destinations.push(game[destinationMap].get(routeID[1] + "-" + routeID[2]));
        } else {
            game["player" + pid].destinations.push(game["long" + destinationMap].get(routeID[1] + "-" + routeID[2]));
        }
        
        game["player" + pid].numberOfRoutes++;

        game.checkContinuity(pid);
        io.in(game.gameID).emit('player-overview', game.getUserProperties());

        if (game.gameState === "routes") {
            console.log('[INFO] Player ' + pid + ' is now ready!')
            game["player" + pid].ready = true;

            if (game.allPlayersReady()) {
                game.currentRound = Math.ceil(Math.random() * game.amountOfPlayers) - 1;

                io.in(game.gameID).emit('player-round', game.getPlayerRound());

                game.mergeAllDestinations();
                console.log('[INFO] The game is now in the ongoing state.');
                game.gameState = 'ongoing';
            }
        }
    });

    socket.on('rejected-destination', (data) => {
        let routeID = data.split("-");
        continent = routeID[0];
        destinationMap = continent + "Desti";
        if (game[destinationMap].get(routeID[1] + "-" + routeID[2]) === undefined) {
            console.log("[INFO] A player rejected a long route");
            game[continent + "Stack"].push([routeID[1] + "-" + routeID[2], game["long" + destinationMap].get(routeID[1] + "-" + routeID[2])]);
            game.shuffleDestis();
        } else {
            console.log("[INFO] A player rejected a short route");
            game[continent + "Stack"].push([routeID[1] + "-" + routeID[2], game[destinationMap].get(routeID[1] + "-" + routeID[2])]);
            game.shuffleDestis();
        }
    });

    socket.on('open-train', (data) => {
        let pid = data.pid;
        console.log("[INFO] Player " + pid + " took an open train.");

        let color = game.getRandomColor();
        let oldColor = game.openCards[data.card];
        game.openCards[data.card] = color;

        io.in(game.gameID).emit('new-open-card', {repCard: data.card, newColor: color});

        if (game.checkNeedForShuffle()) {
            game.setOpenCards();
            io.in(game.gameID).emit('open-cards', {cards: game.getOpenCards(), shuffle: true});
        }

        game["player" + pid].numberOfTrainCards++;
        game["player" + pid][data.color]++;

        if (oldColor === "loco") {
            game["player" + pid][game.getRandomColor()]++;
            game["player" + pid].numberOfTrainCards++;
            game.nextPlayerRound();
        } else {
            game.playerDidSomething();
        }

        io.in(game.gameID).emit('player-overview', game.getUserProperties());
        socket.emit('own-cards', game.getPersonalCards(pid));
        if (game.checkGameEnd()) {
            io.in(game.gameID).emit('game-end');
            setTimeout(function() {
                io.in(game.gameID).emit('final-score', game.calculateScore());
            }, 1000);
        } else {
            io.in(game.gameID).emit('player-round', game.getPlayerRound());
        }
    });

    socket.on('closed-train', (pid) => {
        console.log("[INFO] Player " + pid + " requested a closed train.");
        let color = game.getRandomColor();

        socket.emit('closed-train', color);

        game["player" + pid].numberOfTrainCards++;
        game["player" + pid][color]++;

        game.playerDidSomething();

        io.in(game.gameID).emit('player-overview', game.getUserProperties());
        socket.to(game.gameID).emit('closed-move', {pid: pid, move: "TRAIN-CARD"});
        socket.emit('own-cards', game.getPersonalCards(pid));

        if (game.checkGameEnd()) {
            io.in(game.gameID).emit('game-end');
            setTimeout(function() {
                io.in(game.gameID).emit('final-score', game.calculateScore());
            }, 1000);
        } else {
            io.in(game.gameID).emit('player-round', game.getPlayerRound());
        }
    });

    socket.on('route-claim', (data) => {
        console.log("[INFO] Player " + data.pid + " requested a route.");
        let ret = game.checkEligibility(data.pid, data.color, data.route, data.continent);

        if (ret.status) {
            io.in(game.gameID).emit('route-claim', {status: true, pid: data.pid, route: data.route, pcol: game["player" + data.pid].color, 
            color: ret.color, continent: data.continent});

            game["player" + data.pid].routeIDs.push([data.continent, data.route]);
            game["player" + data.pid][data.color] -= ret.amount;
            game["player" + data.pid].loco -= ret.locos;
            game["player" + data.pid].numberOfTrains -= game.getRouteRequirements(data.route, data.continent).length;
            game["player" + data.pid].numberOfTrainCards -= game.getRouteRequirements(data.route, data.continent).length;
            
            io.in(game.gameID).emit('player-overview', game.getUserProperties());
            
            let routeMap = data.continent + "Routes";
            game.userClaimedRoute(data.pid, game[routeMap].get(data.route));

            game.playerPutRoute();

            socket.emit('own-cards', game.getPersonalCards(data.pid));
            if (game.checkGameEnd()) {
                io.in(game.gameID).emit('game-end');
                setTimeout(function() {
                    io.in(game.gameID).emit('final-score', game.calculateScore());
                }, 1000);
            } else {
                io.in(game.gameID).emit('player-round', game.getPlayerRound());
            }
            for (let desti of game.checkContinuity(data.pid)) {
                socket.emit('player-completed-route', desti.continent + "-" + desti.stationA + "-" + desti.stationB);
            }
        } else {
            socket.emit('route-claim', {pid: data.pid, status: false});
        }
    });

    socket.on('player-destination', (pid) => {
        let random = Math.random();
        if (random < 0.5) {
            socket.emit('player-destination', {0: game.getEuDestination(), 1: game.getUsDestination(), 2: game.getUsDestination()});
        } else {
            socket.emit('player-destination', {0: game.getEuDestination(), 1: game.getEuDestination(), 2: game.getUsDestination()});
        }

        socket.to(game.gameID).emit('closed-move', {pid: pid, move: "ROUTE-CARD"});
    });

    socket.on('player-finished', () => {
        if (game.gameState === "ongoing") {
            game.nextPlayerRound();
            if (game.checkGameEnd()) {
                io.in(game.gameID).emit('game-end');
                setTimeout(function() {
                    io.in(game.gameID).emit('final-score', game.calculateScore());
                }, 1000);
            } else {
                io.in(game.gameID).emit('player-round', game.getPlayerRound());
            }
        }
    });
});

server.listen(port);

module.exports = app;