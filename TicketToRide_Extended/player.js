const Utilities = require("./utilities");

const player = function (id, playerName, playerColor, socketID) {
    this.id = id;
    this.name = playerName;
    this.color = playerColor;
    this.score = 0;

    this.numberOfTrains = 50;
    this.numberOfTrainCards = 0;
    this.numberOfRoutes = 0;
    this.numberOfStations = 3;

    this.socketID = socketID;

    this.black = 0;
    this.blue = 0;
    this.brown = 0;
    this.green = 0;
    this.loco = 0;
    this.purple = 0;
    this.red = 0;
    this.white = 0;
    this.yellow = 0;

    this.ready = false;

    this.routes = new Map();
    this.stations = [];
    this.destinations = [];
    this.completedDestinations = [];

    this.routeIDs = [];
};

player.prototype.updatewebsocket = function (socket) {
    this.websocket = socket;
};

player.prototype.isReady = function () {
    this.ready = true;
};

player.prototype.getInitialTrainCards = function () {
    let color1 = Utilities.getRandomColor();
    let color2 = Utilities.getRandomColor();
    let color3 = Utilities.getRandomColor();
    let color4 = Utilities.getRandomColor();
    this[color1]++;
    this[color2]++;
    this[color3]++;
    this[color4]++;
    this.numberOfTrainCards += 4;
};

player.prototype.acceptedDestination = function () {
    // TODO Refractor code so that accepting destinations can be tested.
};

/*
    This function adds a specific train color to the user's inventory.
    If this succeeds, the function returns true. If it does not, the function returns false.

    The `open` boolean specifies if the player took an open card or not.
*/
player.prototype.takeTrain = function (color, open) {
    if (!Utilities.allColorsArray.includes(color)) {
        return false;
    }
    this[color]++;
    this.numberOfTrainCards++;
    if (open) {
        if (color === "loco") {
            this[Utilities.getRandomColor()]++;
            this.numberOfTrainCards++;
        }
    }
    return true;
};

player.prototype.getTrainCards = function () {
    let data = {
        black: this.black,
        blue: this.blue,
        brown: this.brown,
        green: this.green,
        purple: this.purple,
        red: this.red,
        white: this.white,
        yellow: this.yellow,
        loco: this.loco,
    };
    return data;
};

player.prototype.checkEligibility = function (color, routeRequirements) {
    if (this.numberOfTrains < routeRequirements.length) {
        return false;
    }
    let points = Utilities.getScoreFromLength(routeRequirements.length);
    if (this[color] >= routeRequirements.length) {
        if (routeRequirements.color === "any") {
            this.routeClaimed(points, color, routeRequirements.length, 0);
            return true;
        } else {
            if (color === routeRequirements.color) {
                this.routeClaimed(points, color, routeRequirements.length, 0);
                return true;
            } else {
                if (color === "loco") {
                    this.routeClaimed(points, color, 0, routeRequirements.length);
                    return {
                        status: true,
                        color: color,
                        amount: 0,
                        locos: routeRequirements.length,
                    };
                } else {
                    return false;
                }
            }
        }
    } else if (this[color] + this.loco >= routeRequirements.length) {
        if (routeRequirements.color === "any" || color === routeRequirements.color) {
            let amount = this[color];
            let locos = routeRequirements.length - this[color];
            this.routeClaimed(points, color, amount, locos);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

player.prototype.routeClaimed = function (points, color, amount, locos) {
    this.score += points;
    this[color] -= amount;
    this.loco -= locos;

    this.numberOfTrainCards -= amount + locos;
    this.numberOfTrains -= amount + locos;
};

player.prototype.getPlayerProperties = function () {
    return {
        id: this.id,
        name: this.name,
        score: this.score,
        color: this.color,
        numberOfTrains: this.numberOfTrains,
        numberOfTrainCards: this.numberOfTrainCards,
        numberOfRoutes: this.numberOfRoutes,
        numberOfStations: this.numberOfStations
    };
};

module.exports = player;