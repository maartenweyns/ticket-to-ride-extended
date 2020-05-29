const player = function (id, playerName, playerColor, socketID) {
    this.id = id;
    this.name = playerName;
    this.color = playerColor;
    this.score = 0;

    this.numberOfTrains = 10;
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

module.exports = player;
