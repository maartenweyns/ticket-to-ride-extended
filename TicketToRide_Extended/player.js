const player = function (id, playerName, playerColor, playerWebsocket) {
    this.id = id;
    this.name = playerName;
    this.color = playerColor;
    this.score = 0;
    this.numberOfTrains = 3;
    this.websocket = playerWebsocket;
    this.numberOfTrainCards = 0;
    this.numberOfRoutes = 0;
    this.black = 0;
    this.blue = 0;
    this.brown = 0;
    this.green = 0;
    this.loco = 0;
    this.purple = 0;
    this.red = 0;
    this.white = 0;
    this.yellow = 0;

    this.ready = null;

    this.routes = new Map();
    this.destinations = [];
    this.completedDestinations = [];
};

player.prototype.sendMessage = function (msg) {
    this.websocket.send(JSON.stringify(msg));
};

player.prototype.updatewebsocket = function (socket) {
    this.websocket = socket;
};

player.prototype.isReady = function () {
    this.ready = true;
}

module.exports = player;