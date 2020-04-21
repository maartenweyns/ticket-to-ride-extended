var route = require("./route");

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
    this.euRoutes = new Map();
};

game.prototype.setOpenCards = function () {
    this.openCards.Card0 = this.getRandomColor();
    this.openCards.Card1 = this.getRandomColor();
    this.openCards.Card2 = this.getRandomColor();
    this.openCards.Card3 = this.getRandomColor();
    this.openCards.Card4 = this.getRandomColor();
};

game.prototype.getOpenCards = function () {
    return this.openCards;
};

game.prototype.checkNeedForShuffle = function () {
    let amountOfLocos = 0;
    for (let i = 0; i < 5; i++) {
        if (this.openCards["Card" + i] === "loco") {
            amountOfLocos++;
        }
    }
    console.log("The deck has been checked to 3 locomotives. The amount of locomotives is " + amountOfLocos);
    return amountOfLocos >= 3;
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

game.prototype.sendToAll = function (msg) {
    for (let i = 0; i < 8; i++) {
        if (this["player" + i] !== null) {
            this["player" + i].sendMessage(msg);
        }
    }
};

game.prototype.getUserProperties = function () {
    let returnObject = [];
    for (let i = 0; i < 8; i++) {
        if (this["player" + i] !== null) {
            let player = {
                name: this["player" + i].name, score: this["player" + i].score,
                color: this["player" + i].color, numberOfTrains: this["player" + i].numberOfTrains,
                numberOfTrainCards: this["player" + i].numberOfTrainCards,
                numberOfRoutes: this["player" + i].numberOfRoutes
            };
            returnObject.push(player);
        }
    }
    return returnObject;
};

game.prototype.setupEuRoutes = function () {
    this.euRoutes.set("edinburgh-londen-1", new route("edinburgh", "londen", 1, "black", 4, 0));
    this.euRoutes.set("edinburgh-londen-2", new route("edinburgh", "londen", 2, "brown", 4, 0));
    this.euRoutes.set("amsterdam-londen-1", new route("amsterdam", "londen", 1, "any", 2, 2));
    this.euRoutes.set("amsterdam-essen-1", new route("amsterdam", "essen", 1, "yellow", 3, 0));
    this.euRoutes.set("amsterdam-brussels-1", new route("amsterdam", "brussels", 1, "black", 1, 0));
    this.euRoutes.set("dieppe-londen-1", new route("dieppe", "londen", 1, "any", 2, 1));
    this.euRoutes.set("dieppe-londen-2", new route("dieppe", "londen", 2, "any", 2, 1));
    this.euRoutes.set("brussels-dieppe-1", new route("brussels", "dieppe", 1, "green", 2, 0));
    this.euRoutes.set("brest-dieppe-1", new route("brest", "dieppe", 1, "brown", 2, 0));
    this.euRoutes.set("brest-paris-1", new route("brest", "paris", 1, "black", 3, 0));
    this.euRoutes.set("dieppe-paris-1", new route("dieppe", "paris", 1, "purple", 1, 0));
    this.euRoutes.set("brussels-paris-1", new route("brussels", "paris", 1, "yellow", 2, 0));
    this.euRoutes.set("brussels-paris-2", new route("brussels", "paris", 2, "red", 2, 0));
    this.euRoutes.set("brussels-frankfurt-1", new route("brussels", "frankfurt", 1, "blue", 2, 0));
    this.euRoutes.set("amsterdam-frankfurt-1", new route("amsterdam", "frankfurt", 1, "white", 2, 0));
    this.euRoutes.set("essen-frankfurt-1", new route("essen", "frankfurt", 1, "green", 2, 0));
    this.euRoutes.set("frankfurt-paris-1", new route("frankfurt", "paris", 1, "white", 3, 0));
    this.euRoutes.set("frankfurt-paris-2", new route("frankfurt", "paris", 2, "brown", 3, 0));
    this.euRoutes.set("essen-kopenhagen-1", new route("essen", "kopenhagen", 1, "any", 3, 1));
    this.euRoutes.set("essen-kopenhagen-2", new route("essen", "kopenhagen", 2, "any", 3, 1));
    this.euRoutes.set("berlin-essen-1", new route("berlin", "essen", 1, "blue", 2, 0));
    this.euRoutes.set("berlin-frankfurt-1", new route("berlin", "frankfurt", 1, "black", 3, 0));
    this.euRoutes.set("berlin-frankfurt-2", new route("berlin", "frankfurt", 2, "red", 3, 0));
    this.euRoutes.set("brest-pamplona-1", new route("brest", "pamplona", 1, "purple", 4, 0));
    this.euRoutes.set("pamplona-paris-1", new route("pamplona", "paris", 1, "blue", 4, 0));
    this.euRoutes.set("pamplona-paris-2", new route("pamplona", "paris", 2, "green", 4, 0));
    this.euRoutes.set("madrid-pamplona-1", new route("madrid", "pamplona", 1, "black", 3, 0));
    this.euRoutes.set("madrid-pamplona-2", new route("madrid", "pamplona", 2, "white", 3, 0));
    this.euRoutes.set("lissabon-madrid-1", new route("lissabon", "madrid", 1, "purple", 3, 0));
    this.euRoutes.set("cadiz-madrid-1", new route("cadiz", "madrid", 1, "brown", 3, 0));
    this.euRoutes.set("cadiz-lissabon-1", new route("cadiz", "lissabon", 1, "blue", 2, 0));
    this.euRoutes.set("barcelona-madrid-1", new route("barcelona", "madrid", 1, "yellow", 2, 0));
    this.euRoutes.set("barcelona-pamplona-1", new route("barcelona","pamplona",1,"any",2,0));
    this.euRoutes.set("barcelona-marseille-1", new route("barcelona","marseille",1,"any",4,0));
    this.euRoutes.set("marseille-pamplona-1", new route("marseille","pamplona",1,"red",4,0));
    this.euRoutes.set("marseille-paris-1", new route("marseille","paris",1,"any",4,0));
    this.euRoutes.set("marseille-zurich-1", new route("marseille","zurich",1,"purple",2,0));
    this.euRoutes.set("paris-zurich-1", new route("paris","zurich",1,"any",3,0));
    this.euRoutes.set("frankfurt-munchen-1", new route("frankfurt","munchen",1,"purple",2,0));
    this.euRoutes.set("munchen-zurich-1", new route("munchen","zurich",1,"yellow",2,0));
    this.euRoutes.set("kopenhagen-stockholm-1", new route("kopenhagen","stockholm",1,"yellow",3,0));
    this.euRoutes.set("kopenhagen-stockholm-2", new route("kopenhagen","stockholm",2,"white",3,0));
    this.euRoutes.set("munchen-venice-1", new route("munchen","venice",1,"blue",2,0));
    this.euRoutes.set("venice-zurich-1", new route("venice","zurich",1,"green",2,0));
    this.euRoutes.set("marseille-rome-1", new route("marseille","rome",1,"any",4,0));
    this.euRoutes.set("palermo-rome-1", new route("palermo","rome",1,"any",4,1));
    this.euRoutes.set("brindisi-palermo-1", new route("brindisi","palermo",1,"any",3,1));
    this.euRoutes.set("brindisi-rome-1", new route("brindisi","rome",1,"white",2,0));
    this.euRoutes.set("rome-venice-1", new route("rome","venice",1,"black",2,0));
    this.euRoutes.set("venice-zagreb-1", new route("venice","zagreb",1,"any",2,0));
    this.euRoutes.set("sarajevo-zagreb-1", new route("sarajevo","zagreb",1,"red",3,0));
    this.euRoutes.set("munchen-wein-1", new route("munchen","wein",1,"brown",3,0));
    this.euRoutes.set("wein-zagreb-1", new route("wein","zagreb",1,"any",2,0));
    this.euRoutes.set("berlin-wein-1", new route("berlin","wein",1,"green",3,0));
    this.euRoutes.set("berlin-danzig-1", new route("berlin","danzig",1,"any",4,0));
    this.euRoutes.set("berlin-warsaw-1", new route("berlin","warsaw",1,"purple",4,0));
    this.euRoutes.set("berlin-warsaw-2", new route("berlin","warsaw",2,"yellow",4,0));
    this.euRoutes.set("danzig-warsaw-1", new route("danzig","warsaw",1,"any",2,0));
    this.euRoutes.set("warsaw-wein-1", new route("warsaw","wein",1,"blue",4,0));
    this.euRoutes.set("budapest-wein-1", new route("budapest","wein",1,"red",1,0));
    this.euRoutes.set("budapest-wein-2", new route("budapest","wein",2,"white",1,0));
    this.euRoutes.set("budapest-zagreb-1", new route("budapest","zagreb",1,"brown",2,0));
    this.euRoutes.set("budapest-sarajevo-1", new route("budapest","sarajevo",1,"purple",3,0));
    this.euRoutes.set("athina-sarajevo-1", new route("athina","sarajevo",1,"green",4,0));
    this.euRoutes.set("athina-brindisi-1", new route("athina","brindisi",1,"any",4,1));
    this.euRoutes.set("palermo-smyrna-1", new route("palermo","smyrna",1,"any",6,2));
    this.euRoutes.set("athina-smyrna-1", new route("athina","smyrna",1,"any",2,1));
    this.euRoutes.set("athina-sofia-1", new route("athina","sofia",1,"purple",3,0));
};

game.prototype.getRouteRequirements = function (routeID) {
    let route = this.euRoutes.get(routeID);
    if (route !== undefined) {
        return {color: route.color, length: route.length, locos: route.locoReq};
    }
    return undefined;
};

game.prototype.checkEligibility = function (pid, color, routeID) {
    let routeRequirements = this.getRouteRequirements(routeID);

    if (this["player" + pid][color] >= routeRequirements.length) {
        if (routeRequirements.color === "any") {
            return true;
        } else {
            return color === routeRequirements.color;
        }
    } else if ((this["player" + pid][color] + this["player" + pid].loco) >= routeRequirements.length) {
        if (routeRequirements.color === "any") {
            return true;
        } else {
            return color === routeRequirements.color
        }
    } else {
        return false;
    }
};

module.exports = game;
