var indexRouter = require('./routes/index');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require("http");

const Game = require("./game");
const Utilities = require('./utilities');

var app = express();

require('dotenv').config({path: './auth.env'});
const {auth} = require('express-openid-connect');

// Auth0 authentication details
const authConfig = {
    required: false,
    auth0Logout: true,
    appSession: {
      secret: process.env.AUTH_SECRET
    },
    baseURL: 'https://tickettoride.mawey.be',
    clientID: '6536rh17o9VD1KkqEvz02Rz4vECMnwR5',
    issuerBaseURL: 'https://dev-osfslp4f.eu.auth0.com'
};
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(auth(authConfig));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use('/', indexRouter);

var server = http.createServer(app);
const io = require('socket.io')(server);

let games = new Map();

function getUnusedGameCode() {
    let gid = `TTR${Math.floor(Math.random() * 10000)}`;
    if (games.has(gid)) {
        return getUnusedGameCode();
    } else {
        return gid;
    }
}

io.on('connection', (socket) => {

    socket.on('create-game', (options) => {
        if (!options.eu && !options.us) {
            socket.emit('something-went-wrong', "You should pick at least one continent!");
            return;
        }
        if (options.amount < 10 || options.amount > 99) {
            socket.emit('something-went-wrong', "You should set the amount of trains between 10 and 99!");
            return;
        }
        let gid = getUnusedGameCode();
		games.set(gid, new Game(gid, options.eu, options.us, options.amount));
        socket.emit('join', gid);
        console.log(`[CREATEGAME] Game with id ${gid} created!`);
    });

    socket.on('player-name', (data) => {
		let name = data.name;
		let gid = data.gid;
        let game = games.get(gid);
        // Check if the game exists
		if (game === undefined) {
		    socket.emit('invalid-game');
		    return;
		}
        // Add the player to the game
        let result = game.addPlayer(name, socket.id);
        if (result.status) {
            // Do the neccesary socket operations and communitcations
            socket.join(game.gameID);
            socket.emit('information', {playerID: result.id, gameID: game.gameID});
            io.in(game.gameID).emit('player-overview', game.getUserProperties());
        } else {
            // Send error to client
            socket.emit('something-went-wrong', result.message);
        }
    });

    socket.on('start-game', () => {
		let game = games.get(Object.keys(socket.rooms)[1]);
		if (game === undefined) {
	    	socket.emit('invalid-game');
	    	return;
		}
        console.log('[STARTGAME] The game has been started by id ' + socket.id);
        game.gameState = 'routes';
        io.in(game.gameID).emit('start-game');
    });

    // FIXME Reloading on a single map game does not work
    socket.on('player-ingame-join', (info) =>  {
        let game = games.get(info.gameID);

        if (game === undefined) {
            socket.emit('lobby');
            return;
        }

        // Put the socket in the game room
        socket.join(info.gameID);

        let pid = info.playerID;

        // Send game options
        socket.emit('game-options', game.getOptions());

        // Send open cards
        socket.emit('open-cards', {cards: game.getOpenCards(), shuffle: false});

        // Send player info
        socket.emit('player-overview', game.getUserProperties());

        console.log("[UPGRADE] Player " + pid + " updated his socketID to " + socket.id);
        game.updatePlayerSocket(pid, socket.id);

        if (game.gameState === 'ongoing') {
            socket.emit('player-round', game.getPlayerRound());
            socket.emit('own-cards', game.getPlayerTrainCards(pid));
            socket.emit('own-destinations', game.getPlayerDestinations(pid));

            socket.emit('existing-trains', game.getExistingTrainImages());
        }

        if (game.gameState === 'routes') {
            game.createInitialTrianCardsForPlayer(pid);
            socket.emit('own-cards', game.getPlayerTrainCards(pid));

            let routes = game.getInitialDestinations(pid);
            socket.emit('initial-routes', routes);
        }
    });

    socket.on('request-scoring', (data) => {
        let game = games.get(data.gameID);
        if (game !== undefined) {
            if (game.endGameNow) {
                socket.emit('player-overview', game.getUserProperties());
                socket.emit('final-score', game.calculateScore());
            } else {
                socket.emit('play');
            }
        } else {
            socket.emit('lobby');
        }
    });

    socket.on('validate-first-destinations', (data) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        let result = game.validateFirstRoutesPicked(data);

        if (result.result) {
            socket.emit('validate-first-destinations', true);
        } else {
            socket.emit('invalidmove', {message: result.message});
        }
    });

    socket.on('accepted-destination', (data) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
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
        let game = games.get(Object.keys(socket.rooms)[1]);
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
        let game = games.get(Object.keys(socket.rooms)[1]);
        let pid = data.pid;
        console.log("[INFO] Player " + pid + " took an open train.");

        if (game.currentRound !== pid) {
            socket.emit('invalidmove', {message: 'It is currently not your turn!'});
            return;
        }

        if (game.routesLayed !== 0) {
            socket.emit('invalidmove', {message: 'You cannot pick cards after claiming a route!'});
            return;
        }

        if (game.thingsDone !== 0 && data.color === 'loco') {
            socket.emit('invalidmove', {message: 'You cannot pick a locomotive at the beginning of your turn!'});
            return;
        }

        let color = Utilities.getRandomColor();
        let oldColor = game.openCards[data.card];
        game.openCards[data.card] = color;

        io.in(game.gameID).emit('new-open-card', {repCard: data.card, newColor: color, pid: pid});

        if (game.checkNeedForShuffle()) {
            game.setOpenCards();
            io.in(game.gameID).emit('open-cards', {cards: game.getOpenCards(), shuffle: true});
        }

        game["player" + pid].takeTrain(data.color, true);

        if (oldColor === "loco") {
            game.nextPlayerRound();
        } else {
            game.playerDidSomething();
        }

        io.in(game.gameID).emit('player-overview', game.getUserProperties());
        socket.emit('own-cards', game["player" + pid].getTrainCards());
        if (game.checkGameEnd()) {
            game.sendStationsMessage(io);
            if (game.allPlayersReady()) {
                io.in(game.gameID).emit('game-end');
            };
        } else {
            io.in(game.gameID).emit('player-round', game.getPlayerRound());
        }
    });

    socket.on('closed-train', (pid) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        console.log("[INFO] Player " + pid + " requested a closed train.");

        if (game.currentRound !== pid) {
            socket.emit('invalidmove', {message: 'It is currently not your turn!'});
            return;
        }

        if (game.routesLayed !== 0) {
            socket.emit('invalidmove', {message: 'You cannot pick cards after claiming a route!'});
            return;
        }

        let color = Utilities.getRandomColor();

        socket.emit('closed-train', color);

        game["player" + pid].takeTrain(color, false);
        game.playerDidSomething();

        io.in(game.gameID).emit('player-overview', game.getUserProperties());
        socket.to(game.gameID).emit('closed-move', {pid: pid, move: "TRAIN-CARD"});
        socket.emit('own-cards', game["player" + pid].getTrainCards());

        if (game.checkGameEnd()) {
            game.sendStationsMessage(io);
            if (game.allPlayersReady()) {
                io.in(game.gameID).emit('game-end');
            };
        } else {
            io.in(game.gameID).emit('player-round', game.getPlayerRound());
        }
    });

    socket.on('route-claim', (data) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        console.log("[INFO] Player " + data.pid + " requested a route.");

        if (data.pid !== game.currentRound) {
            socket.emit('route-claim', {status: 'notYourTurn'});
            return;
        }

        if (game.routesLayed === 0 && game.thingsDone !== 0) {
            socket.emit('invalidmove', {message: 'You cannot claim a route after picking cards!'});
            return;
        }

        if (game.lastContinentRoutePut === data.continent) {
            socket.emit('route-claim', {status: 'alreadyClaimedThis', continent: data.continent});
            return;
        }

        let ret = game.checkEligibility(data.pid, data.color, data.route, data.continent);

        if (ret) {
            game.imagery.computeWagons(data.continent, data.route, game["player" + data.pid].color, io);

            game["player" + data.pid].routeIDs.push([data.continent, data.route]);

            io.in(game.gameID).emit('player-overview', game.getUserProperties());
            socket.emit('route-claim', {status: 'accepted', continent: data.continent});

            let routeMap = data.continent + "Routes";
            game.userClaimedRoute(data.pid, game[routeMap].get(data.route));

            game.playerPutRoute(data.continent);

            socket.emit('own-cards', game["player" + data.pid].getTrainCards());
            if (game.checkGameEnd()) {
                game.sendStationsMessage(io);
                if (game.allPlayersReady()) {
                    io.in(game.gameID).emit('game-end');
                };
            } else {
                io.in(game.gameID).emit('player-round', game.getPlayerRound());
            }
            for (let desti of game.checkContinuity(data.pid)) {
                socket.emit('player-completed-route', desti.continent + "-" + desti.stationA + "-" + desti.stationB);
            }
        } else {
            socket.emit('route-claim', {status: 'cant'});
        }
    });

    socket.on('station-claim', (data) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        console.log(`[INFO] Player ${data.pid} requested a station on ${data.city}`);

        if (game.currentRound !== data.pid) {
            socket.emit('invalidmove', {message: 'It is currently not your turn!'});
            return;
        }

        if (game.routesLayed === 0 && game.thingsDone !== 0) {
            socket.emit('invalidmove', {message: 'You cannot claim a station after picking cards!'});
            return;
        }

        let result = game.requestStation(data.pid, data.city, data.color);
        socket.emit('station-claim', result);

        if (result) {
            game.imagery.computeStations(data.continent, data.city, game[`player${data.pid}`].color, io);

            game.playerPutRoute('eu');
            socket.emit('own-cards', game["player" + data.pid].getTrainCards());
            io.in(game.gameID).emit('player-overview', game.getUserProperties());
            io.in(game.gameID).emit('player-round', game.getPlayerRound());
        }
    });

    socket.on('confirmed-stations', (data) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        game.userConfirmedStation(data.pid, data.routes);

        for (let desti of game.checkContinuity(data.pid)) {
            socket.emit('player-completed-route', desti.continent + "-" + desti.stationA + "-" + desti.stationB);
        }

        game[`player${data.pid}`].ready = true;

        if (game.allPlayersReady()) {
            io.in(game.gameID).emit('game-end');
        };
    });

    socket.on('player-destination', (pid) => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        if (game.currentRound !== pid) {
            socket.emit('invalidmove', {message: 'It is currently not your turn!'});
            return;
        }

        if (game.thingsDone !== 0) {
            socket.emit('invalidmove', {message: 'You can only pick routes at the beginning of your turn!'});
            return;
        }
        socket.emit('player-destination', game.getDestination());
        socket.to(game.gameID).emit('closed-move', {pid: pid, move: "ROUTE-CARD"});
    });

    socket.on('player-finished', () => {
        let game = games.get(Object.keys(socket.rooms)[1]);
        if (game.gameState === "ongoing") {
            game.nextPlayerRound();
            if (game.checkGameEnd()) {
                game.sendStationsMessage(io);
                if (game.allPlayersReady()) {
                    io.in(game.gameID).emit('game-end');
                };
            } else {
                io.in(game.gameID).emit('player-round', game.getPlayerRound());
            }
        }
    });
});

let port = port = process.env.PORT || 8080;

console.info('Starting serever on port ' + port);
server.listen(port);
console.info('[SERVERSTART] Server started!');

module.exports = app;
