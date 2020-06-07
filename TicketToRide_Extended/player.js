const Utilities = require('./utilities');

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
}

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
}

player.prototype.acceptedDestination = function () {
    // TODO Refractor code so that accepting destinations can be tested.
}

/*
    This function adds a specific train color to the user's inventory.
    If this succeeds, the function returns 1. If it does not, the function returns -1.

    The `open` boolean specifies if the player took an open card or not.
*/
player.prototype.takeTrain = function (color, open) {
    if (!Utilities.allColorsArray.includes(color)) {
        return -1;
    }
    this[color]++;
    this.numberOfTrainCards++;
    if (open) {
        if (color === 'loco') {
            this[Utilities.getRandomColor()]++;
            this.numberOfTrainCards++;
        }
    }
    return 1;
}

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
        loco: this.loco
    };
    return data;
}

module.exports = player;
