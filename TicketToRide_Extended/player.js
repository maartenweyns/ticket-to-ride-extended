const player = function (playerName, playerColor, playerWebsocket) {
    this.name = playerName;
    this.color = playerColor;
    this.score = 0;
    this.numberOfTrains = 60;
    this.websocket = playerWebsocket;
    this.numberOfTrainCards = 0;
    this.numberOfRoutes = 0;
};

player.prototype.sendMessage = function (msg) {
    this.websocket.send(JSON.stringify(msg));
};

module.exports = player;
