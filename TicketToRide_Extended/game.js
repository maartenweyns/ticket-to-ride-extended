const Imagery = require("./imagery");
const Player = require("./player");
const Utilities = require("./utilities");
const SetupData = require("./setupData");

const game = function (gameID, withEu, withUs, numTrains) {
    this.gameID = gameID;

    this.options = {eu: withEu, us: withUs, trains: numTrains};

    this.imagery = new Imagery(this.gameID);

    this.player0 = null;
    this.player1 = null;
    this.player2 = null;
    this.player3 = null;
    this.player4 = null;
    this.player5 = null;
    this.player6 = null;
    this.player7 = null;

    this.openCards = {
        Card0: undefined,
        Card1: undefined,
        Card2: undefined,
        Card3: undefined,
        Card4: undefined,
    };

    this.euRoutes = new Map();
    this.euDesti = new Map();
    this.longeuDesti = new Map();
    this.euStack = [];

    this.usRoutes = new Map();
    this.usDesti = new Map();
    this.longusDesti = new Map();
    this.usStack = [];

    this.longEuStack = [];
    this.longUsStack = [];
    this.longStack = [];

    this.currentRound = null;
    this.thingsDone = 0;
    this.routesLayed = 0;
    this.lastContinentRoutePut = null;

    this.lastRoundPlayer = null;
    this.endGameNow = false;
    this.endGameInARound = false;

    this.amountOfPlayers = 0;

    this.setupEuDestinations();
    this.setupEuRoutes();
    this.setupUsRoutes();
    this.setupUsDestinations();
    this.setOpenCards();

    // Setup long destinations stacks for later use.
    this.longEuStack = shuffleArray(
        Array.from(this.longeuDesti)
    );
    this.longUsStack = shuffleArray(
        Array.from(this.longusDesti)
    );
    this.longStack = shuffleArray(
        Array.from(this.longeuDesti).concat(Array.from(this.longusDesti))
    );

    this.claimedRoutes = [];
    this.claimedCities = [];

    this.gameState = "lobby";

    this.playerColors = [
        "yellow",
        "lightblue",
        "grey",
        "purple",
        "red",
        "green",
        "brightyellow",
        "blue",
    ];
};

game.prototype.addPlayer = function (name, socketid) {
    // Check for an empty name ignoring whitespaces
    if (name.replace(/\s+/g, "") === "") {
        return { status: false, message: "Your name shoud not be empty!" };
    }
    // Check for names that are too long
    if (name.length > 10) {
        return { status: false, message: "Your name shoud not exceed 10 characters!" };
    }
    // Check if the game is full
    if (this.amountOfPlayers >= 8) {
        return { status: false, message: "This game is full!" };
    }
    // Check if the game is still in the lobby state
    if (this.gameState !== "lobby") {
        return { status: false, message: "This game has already started!" };
    }
    // Add the player to the game
    let player = new Player(this.amountOfPlayers, name, this.playerColors.pop(), socketid, this.options.trains);
    this[`player${this.amountOfPlayers}`] = player;
    this.amountOfPlayers++;
    // console.log(`[INFO] A player joined game ${this.gameID}`);
    return { status: true, id: player.id };
};

game.prototype.isFull = function () {
    return this.amountOfPlayers >= 8;
};

game.prototype.setOpenCards = function () {
    this.openCards.Card0 = Utilities.getRandomColor();
    this.openCards.Card1 = Utilities.getRandomColor();
    this.openCards.Card2 = Utilities.getRandomColor();
    this.openCards.Card3 = Utilities.getRandomColor();
    this.openCards.Card4 = Utilities.getRandomColor();

    if (this.checkNeedForShuffle()) {
        this.setOpenCards();
    }
};

game.prototype.getOpenCards = function () {
    return this.openCards;
};

game.prototype.getOptions = function () {
    return this.options;
};

// TODO Test this method
game.prototype.validateFirstRoutesPicked = function (data) {
    if (data === undefined) {
        return {result: false, message: "You should pick at least two routes, one form Europe and one from America."};
    }
    if (!Utilities.validateFirstRoutesPicked(data, this.options.eu, this.options.us)) {
        if (this.options.eu && this.options.us) {
            // Both continents are in the game
            return {result: false, message: "You should pick at least two routes, one form Europe and one from America."};
        } else {
            // There is only one continent in the game
            return {result: false, message: "You should pick at least two routes!"};
        }
    } else {
        return {result: true};
    }
};

// TODO Test this method
game.prototype.getInitialDestinations = function (pid) {
    if (this[`player${pid}`].initialDestinations.length === 0) {
        if (this.options.eu && this.options.us) {
            // Both continents are participating in the game. Get  routes from both.
            let longdesti = this.longStack.pop();
            if (longdesti[1].continent === "eu") {
                this[`player${pid}`].initialDestinations = [longdesti, this.getEuDestination(), this.getUsDestination(), this.getUsDestination()]
            } else {
                this[`player${pid}`].initialDestinations = [this.getEuDestination(), this.getEuDestination(), longdesti, this.getUsDestination()]
            }
        } else {
            // One continent does not participate in the game. Get routes only from the other continent.
            // Define participating continent
            let participating = '';
            if (!this.options.eu) {
                participating = "Us";
            } else {
                participating = "Eu";
            }

            // Get routes from participating continent
            let longdesti = this[`long${participating}Stack`].pop();
            this[`player${pid}`].initialDestinations = [longdesti, this[`get${participating}Destination`](), this[`get${participating}Destination`]()]
        }
    }
    return this[`player${pid}`].initialDestinations;
}

// TODO Test this method
game.prototype.getDestination = function () {
    if (this.options.eu && this.options.us) {
        // Both continents are participating in the game

        let random = Math.random();
        if (random < 0.5) {
            return [this.getEuDestination(), this.getUsDestination(), this.getUsDestination()];
        } else {
            return [this.getEuDestination(), this.getEuDestination(), this.getUsDestination()];
        }
    } else {
        // There is only one continent in the game
        // Define participating continent
        let participating = '';
        if (!this.options.eu) {
            participating = "Us";
        } else {
            participating = "Eu";
        }

        // Get routes from participating continent
        return [this[`get${participating}Destination`](), this[`get${participating}Destination`](), this[`get${participating}Destination`]()];
    }
};

game.prototype.checkNeedForShuffle = function () {
    let amountOfLocos = 0;
    for (let i = 0; i < 5; i++) {
        if (this.openCards[`Card${i}`] === "loco") {
            amountOfLocos++;
        }
    }
    return amountOfLocos >= 3;
};

game.prototype.getUserProperties = function () {
    let returnObject = [];
    for (let i = 0; i < 8; i++) {
        if (this[`player${i}`] !== null) {
            returnObject.push(this[`player${i}`].getPlayerProperties());
        }
    }
    return returnObject;
};

game.prototype.updatePlayerSocket = function (playerid, socketid) {
    return this[`player${playerid}`].updatewebsocket(socketid);
};

game.prototype.createInitialTrianCardsForPlayer = function (playerid) {
    this[`player${playerid}`].getInitialTrainCards();
};

game.prototype.getPlayerTrainCards = function (playerid) {
    if (this[`player${playerid}`] !== null) {
        return this[`player${playerid}`].getTrainCards();
    } else {
        return false;
    }
};

// TODO Test this method
game.prototype.getPlayerDestinations = function (playerid) {
    if (this[`player${playerid}`] !== null) {
        return this[`player${playerid}`].getDestinations();
    } else {
        return false;
    }
};

game.prototype.setupEuRoutes = function () {
    SetupData.setupEuRoutes(this.euRoutes);
};

game.prototype.setupUsRoutes = function () {
    SetupData.setupUsRoutes(this.usRoutes);
};

game.prototype.setupEuDestinations = function () {
    SetupData.setupEuDestinations(this.euDesti, this.longeuDesti);
    this.euStack = shuffleArray(Array.from(this.euDesti));
};

game.prototype.setupUsDestinations = function () {
    SetupData.setupUsDestinations(this.usDesti, this.longusDesti);
    this.usStack = shuffleArray(Array.from(this.usDesti));
};

game.prototype.getRouteRequirements = function (routeID, continent) {
    let routeMap = continent + "Routes";
    // console.log("Getting route from " + routeMap);
    let route = this[routeMap].get(routeID);
    if (route !== undefined) {
        return { color: route.color, length: route.length, locos: route.locoReq };
    }
    return undefined;
};

game.prototype.checkEligibility = function (pid, color, routeID, continent) {
    console.log(`[INFO] Checking if the user can claim ${routeID} in  ${continent}`);
    let routeRequirements = this.getRouteRequirements(routeID, continent);

    if (routeRequirements === undefined) {
        return false;
    }

    if (this.claimedRoutes.includes(routeID)) {
        return false;
    }

    if (this[`player${pid}`].numberOfTrains < routeRequirements.length) {
        return false;
    }

    if (this[`player${pid}`].checkEligibility(color, routeRequirements)) {
        this.claimedRoutes.push(routeID);
        return true;
    }
    return false;
};

game.prototype.requestStation = function (playerID, city, color) {
    if (
        this[`player${playerID}`].numberOfStations >= 1 &&
        !this.claimedCities.includes(city) &&
        this[`player${playerID}`][color] >= 1
    ) {
        this[`player${playerID}`].numberOfStations -= 1;
        this[`player${playerID}`].stations.push(city);
        this[`player${playerID}`][color]--;
        this[`player${playerID}`].numberOfTrainCards--;
        this.claimedCities.push(city);
        return true;
    } else {
        return false;
    }
};

game.prototype.playerDidSomething = function () {
    this.thingsDone++;
    if (this.thingsDone > 2) {
        this.nextPlayerRound();
    }
};

game.prototype.playerPutRoute = function (continent) {
    this.thingsDone++;
    this.routesLayed++;
    this.lastContinentRoutePut = continent;
    if (this.routesLayed > 1) {
        this.nextPlayerRound();
    }
};

game.prototype.playerClaimedStation = function () {
    this.thingsDone++;
    this.routesLayed++;
    if (this.routesLayed > 1) {
        this.nextPlayerRound();
    }
};

game.prototype.checkGameEnd = function () {
    return this.endGameNow;
};

game.prototype.nextPlayerRound = function () {
    if (this.endGameInARound) {
        this.endGameNow = true;
    }

    this.thingsDone = 0;
    this.routesLayed = 0;
    this.lastContinentRoutePut = null;
    let nextPlayer = this.currentRound + 1;

    if (this["player" + nextPlayer] === null) {
        nextPlayer = 0;
    }

    if (this.lastRoundPlayer !== null && nextPlayer === this.lastRoundPlayer) {
        this.endGameInARound = true;
    }

    this.currentRound = nextPlayer;
};

game.prototype.getEuDestination = function () {
    return this.euStack.pop();
};

game.prototype.getUsDestination = function () {
    return this.usStack.pop();
};

game.prototype.mergeAllDestinations = function () {
    while (this.longStack.length !== 0) {
        let desti = this.longStack.pop();
        if (desti[1].continent === "eu") {
            this.euStack.push(desti);
        } else {
            this.usStack.push(desti);
        }
    }
    this.euStack = shuffleArray(this.euStack);
    this.usStack = shuffleArray(this.usStack);
};

function shuffleArray(array) {
    var m = array.length,
        t,
        i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

game.prototype.shuffleDestis = function () {
    this.euStack = shuffleArray(this.euStack);
    this.usStack = shuffleArray(this.usStack);
};

game.prototype.userClaimedRoute = function (playerID, route) {
    if (this["player" + playerID].routes.get(route.stationA) === undefined) {
        this["player" + playerID].routes.set(route.stationA, [route]);
    } else {
        this["player" + playerID].routes.get(route.stationA).push(route);
    }

    if (this["player" + playerID].routes.get(route.stationB) === undefined) {
        this["player" + playerID].routes.set(route.stationB, [route]);
    } else {
        this["player" + playerID].routes.get(route.stationB).push(route);
    }
};

game.prototype.checkContinuity = function (playerID) {
    let destis = this["player" + playerID].destinations;
    let unfinished = [];
    let returnobject = [];
    for (let desti of destis) {
        if (checkContinuity(this["player" + playerID], desti.stationA, desti.stationB)) {
            this["player" + playerID].completedDestinations.push(desti);
            returnobject.push(desti);
        } else {
            unfinished.push(desti);
        }
    }
    this["player" + playerID].destinations = unfinished;

    return returnobject;
};

game.prototype.allPlayersReady = function () {
    for (let i = 0; i < this.amountOfPlayers; i++) {
        if (!this["player" + i].ready) {
            return false;
        }
    }
    return true;
};

game.prototype.getPlayerRound = function () {
    for (let i = 0; i < this.amountOfPlayers; i++) {
        if (this["player" + i].numberOfTrains <= 2) {
            if (this.lastRoundPlayer === null) {
                this.lastRoundPlayer = i;
            }

            return { pid: this.currentRound, thing: this.thingsDone, lastRound: true };
        }
    }
    return { pid: this.currentRound, thing: this.thingsDone, lastRound: false };
};

game.prototype.sendStationsMessage = function (io) {
    this.currentRound = 8;
    for (let i = 0; i < 8; i++) {
        if (this[`player${i}`] !== null) {
            let neighbors = [];
            for (let city of this[`player${i}`].stations) {
                let ret = [];
                for (let routeID of this.claimedRoutes) {
                    let stations = routeID.split("-");
                    if (stations[0] === city || stations[1] === city) {
                        if (stations[0] === city) {
                            if (!ret.includes(stations[1])) {
                                ret.push(stations[1].toUpperCase());
                            }
                        } else {
                            if (!ret.includes(stations[0])) {
                                ret.push(stations[0].toUpperCase());
                            }
                        }
                    }
                }
                neighbors.push(ret);
            }
            if (this[`player${i}`].stations.length !== 0) {
                this[`player${i}`].ready = false;
            }
            let sendObj = { stations: this[`player${i}`].stations, options: neighbors };
            io.to(this[`player${i}`].socketID).emit("stations", sendObj);
        }
    }
};

game.prototype.getExistingTrainImages = function () {
    return {eu: this.imagery.euWagonImage, us: this.imagery.usWagonImage};
}

game.prototype.calculateScore = function () {
    let returnObject = [];
    for (let i = 0; i < 8; i++) {
        if (this["player" + i] !== null) {
            let player = {
                id: i,
                score: this["player" + i].score,
                color: this["player" + i].color,
                destinations: this["player" + i].destinations,
                completedDestinations: this["player" + i].completedDestinations,
                stations: this[`player${i}`].numberOfStations,
            };
            returnObject.push(player);
        }
    }
    return returnObject;
};

function checkContinuity(player, stationA, stationB) {
    let map = player.routes;
    let visited = [];

    let recursion = function (startingStation, endingStation) {
        let stationList = map.get(startingStation);
        if (stationList !== undefined) {
            visited.push(startingStation);
            for (let i = 0; i < stationList.length; i++) {
                if (
                    !visited.includes(stationList[i].stationA) ||
                    !visited.includes(stationList[i].stationB)
                ) {
                    if (
                        stationList[i].stationA === endingStation ||
                        stationList[i].stationB === endingStation
                    ) {
                        return true;
                    } else {
                        if (stationList[i].stationA === startingStation) {
                            if (recursion(stationList[i].stationB, endingStation)) {
                                return true;
                            }
                        } else {
                            if (recursion(stationList[i].stationA, endingStation)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    };
    return recursion(stationA, stationB);
}

module.exports = game;