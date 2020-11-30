const { route } = require("./routes");
const Utilities = require("./utilities");

const player = function (id, playerName, playerColor, socketID, numberOfTrains) {
    this.id = id;
    this.name = playerName;
    this.color = playerColor;
    this.score = 0;

    this.numberOfTrains = numberOfTrains;
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

    this.initialCardsTaken = false;
    this.ready = false;

    this.initialDestinations = [];

    this.routes = new Map();
    this.stations = [];
    this.destinations = [];
    this.completedDestinations = [];

    this.routeIDs = [];
};

player.prototype.updatewebsocket = function (newSocket) {
    if (newSocket === undefined) {
        return false;
    }
    this.socketID = newSocket;
    return true;
};

player.prototype.isReady = function () {
    return this.ready;
};

player.prototype.getInitialTrainCards = function () {
    if (!this.initialCardsTaken) {
        let color1 = Utilities.getRandomColor();
        let color2 = Utilities.getRandomColor();
        let color3 = Utilities.getRandomColor();
        let color4 = Utilities.getRandomColor();
        this[color1]++;
        this[color2]++;
        this[color3]++;
        this[color4]++;
        this.numberOfTrainCards += 4;
        this.initialCardsTaken = true;
    }
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

player.prototype.checkEligibility = function (uColor, routeRequirements) {
    let lRequired = routeRequirements.locos;
    let rColor = routeRequirements.color;
    let rLength = routeRequirements.length;
    let points = Utilities.getScoreFromLength(routeRequirements.length);

    if (this.numberOfTrains < rLength || this.loco < lRequired) {
        // The player does not have enough trains or locomotives
        return false;
    }
    if (uColor === "loco") {
        // The player is claiming the route using only locomotives
        if (this.loco >= rLength) {
            this.routeClaimed(points, "loco", rLength, 0);
            return true;
        } else {
            // The player does not have enough locomotives to pay this route
            return false;
        }
    }
    if (rColor === "any" || uColor == rColor) {
        // This is a grey route or the selected color of the user matches the color of the route
        if (this[uColor] >= rLength) {
            this.routeClaimed(points, uColor, rLength, 0);
            return true;
        } else if (this[uColor] + this.loco >= rLength) {
            // The player is using additional locomotives for this route
            let lUsed = rLength - this[uColor];
            this.routeClaimed(points, uColor, this[uColor], lUsed);
            return true;
        }
    }


};

// TODO Add locomotive requirement and bridge support
player.prototype.checkEligibility = function (color, routeRequirements) {
    if (this.numberOfTrains < routeRequirements.length) {
        // The player does not have enough trains to use this route
        return false;
    }
    if (this.loco < routeRequirements.locos) {
        // The player does not have enough locomotives to use this route
        return false;
    }
    let points = Utilities.getScoreFromLength(routeRequirements.length);
    if (this[color] >= routeRequirements.length - routeRequirements.locos && this.loco >= routeRequirements.locos) {
        // The player can claim the route without the use of additional locomotives
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
                    return true;
                } else {
                    return false;
                }
            }
        }
    } else if (this[color] + this.loco >= routeRequirements.length) {
        // The player will use locomotives for this route claim
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
        numberOfStations: this.numberOfStations,
    };
};

player.prototype.setReady = function (ready) {
    if (ready === true || ready == false) {
        this.ready = ready;
        return true;
    }
    return false;
};

player.prototype.getDestinations = function () {
    return {
        uncompleted: this.destinations,
        completed: this.completedDestinations,
    };
};

module.exports = player;