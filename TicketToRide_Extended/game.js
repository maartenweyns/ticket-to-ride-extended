const game = function (gameID) {
    this.amountOfPlayers = 0;
    this.player0 = null;
    this.player1 = null;
    this.player2 = null;
    this.player3 = null;
    this.player4 = null;
    this.player5 = null;
    this.player6 = null;
    this.player7 = null;
    this.openCards = {};
};

game.prototype.setOpenCards = function () {
    this.openCards.card0 = this.getRandomColor();
    this.openCards.card1 = this.getRandomColor();
    this.openCards.card2 = this.getRandomColor();
    this.openCards.card3 = this.getRandomColor();
    this.openCards.card4 = this.getRandomColor();
};

game.prototype.getOpenCards = function() {
    return this.openCards;
};

game.prototype.getRandomColor = function () {
    var number1 = Math.random();
    if (number1 < 0.87) {
        var number = Math.random();
        if (number < 0.125) {
            return "black";
        } else if (number < 0.25) {
            return "blue";
        } else if (number < 0.375) {
            return "brown";
        } else if (number < 0.5) {
            return "green";
        } else if (number < 0.625) {
            return "purple";
        } else if (number < 0.75) {
            return "red";
        } else if (number < 0.875) {
            return "white";
        } else {
            return "yellow";
        }
    } else {
        return "loco";
    }
};

module.exports = game;
