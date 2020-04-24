var route = require("./route");
var destination = require("./destination");
var messages = require("./public/javascripts/messages");

const game = function (gameID) {
    this.gameID = gameID;

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
    this.euDesti = new Map();
    this.euStack = [];

    this.currentRound = 0;
    this.thingsDone = 0;

    this.setupEuDestinations();
    this.setupEuRoutes();
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
                id: i,
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
    this.euRoutes.set("barcelona-pamplona-1", new route("barcelona", "pamplona", 1, "any", 2, 0));
    this.euRoutes.set("barcelona-marseille-1", new route("barcelona", "marseille", 1, "any", 4, 0));
    this.euRoutes.set("marseille-pamplona-1", new route("marseille", "pamplona", 1, "red", 4, 0));
    this.euRoutes.set("marseille-paris-1", new route("marseille", "paris", 1, "any", 4, 0));
    this.euRoutes.set("marseille-zurich-1", new route("marseille", "zurich", 1, "purple", 2, 0));
    this.euRoutes.set("paris-zurich-1", new route("paris", "zurich", 1, "any", 3, 0));
    this.euRoutes.set("frankfurt-munchen-1", new route("frankfurt", "munchen", 1, "purple", 2, 0));
    this.euRoutes.set("munchen-zurich-1", new route("munchen", "zurich", 1, "yellow", 2, 0));
    this.euRoutes.set("kopenhagen-stockholm-1", new route("kopenhagen", "stockholm", 1, "yellow", 3, 0));
    this.euRoutes.set("kopenhagen-stockholm-2", new route("kopenhagen", "stockholm", 2, "white", 3, 0));
    this.euRoutes.set("munchen-venice-1", new route("munchen", "venice", 1, "blue", 2, 0));
    this.euRoutes.set("venice-zurich-1", new route("venice", "zurich", 1, "green", 2, 0));
    this.euRoutes.set("marseille-rome-1", new route("marseille", "rome", 1, "any", 4, 0));
    this.euRoutes.set("palermo-rome-1", new route("palermo", "rome", 1, "any", 4, 1));
    this.euRoutes.set("brindisi-palermo-1", new route("brindisi", "palermo", 1, "any", 3, 1));
    this.euRoutes.set("brindisi-rome-1", new route("brindisi", "rome", 1, "white", 2, 0));
    this.euRoutes.set("rome-venice-1", new route("rome", "venice", 1, "black", 2, 0));
    this.euRoutes.set("venice-zagreb-1", new route("venice", "zagreb", 1, "any", 2, 0));
    this.euRoutes.set("sarajevo-zagreb-1", new route("sarajevo", "zagreb", 1, "red", 3, 0));
    this.euRoutes.set("munchen-wein-1", new route("munchen", "wein", 1, "brown", 3, 0));
    this.euRoutes.set("wein-zagreb-1", new route("wein", "zagreb", 1, "any", 2, 0));
    this.euRoutes.set("berlin-wein-1", new route("berlin", "wein", 1, "green", 3, 0));
    this.euRoutes.set("berlin-danzig-1", new route("berlin", "danzig", 1, "any", 4, 0));
    this.euRoutes.set("berlin-warsaw-1", new route("berlin", "warsaw", 1, "purple", 4, 0));
    this.euRoutes.set("berlin-warsaw-2", new route("berlin", "warsaw", 2, "yellow", 4, 0));
    this.euRoutes.set("danzig-warsaw-1", new route("danzig", "warsaw", 1, "any", 2, 0));
    this.euRoutes.set("warsaw-wein-1", new route("warsaw", "wein", 1, "blue", 4, 0));
    this.euRoutes.set("budapest-wein-1", new route("budapest", "wein", 1, "red", 1, 0));
    this.euRoutes.set("budapest-wein-2", new route("budapest", "wein", 2, "white", 1, 0));
    this.euRoutes.set("budapest-zagreb-1", new route("budapest", "zagreb", 1, "brown", 2, 0));
    this.euRoutes.set("budapest-sarajevo-1", new route("budapest", "sarajevo", 1, "purple", 3, 0));
    this.euRoutes.set("athina-sarajevo-1", new route("athina", "sarajevo", 1, "green", 4, 0));
    this.euRoutes.set("athina-brindisi-1", new route("athina", "brindisi", 1, "any", 4, 1));
    this.euRoutes.set("palermo-smyrna-1", new route("palermo", "smyrna", 1, "any", 6, 2));
    this.euRoutes.set("athina-smyrna-1", new route("athina", "smyrna", 1, "any", 2, 1));
    this.euRoutes.set("athina-sofia-1", new route("athina", "sofia", 1, "purple", 3, 0));
    this.euRoutes.set("sarajevo-sofia-1", new route("sarajevo", "sofia", 1, "any", 2, 0));
    this.euRoutes.set("petrograd-stockholm-1", new route("petrograd", "stockholm", 1, "any", 8, 0));
    this.euRoutes.set("petrograd-riga-1", new route("petrograd", "riga", 1, "any", 4, 0));
    this.euRoutes.set("danzig-riga-1", new route("danzig", "riga", 1, "black", 3, 0));
    this.euRoutes.set("riga-wilno-1", new route("riga", "wilno", 1, "green", 4, 0));
    this.euRoutes.set("warsaw-wilno-1", new route("warsaw", "wilno", 1, "red", 3, 0));
    this.euRoutes.set("kyiv-warsaw-1", new route("kyiv", "warsaw", 1, "any", 4, 0));
    this.euRoutes.set("budapest-kyiv-1", new route("budapest", "kyiv", 1, "any", 6, 0));
    this.euRoutes.set("kyiv-wilno-1", new route("kyiv", "wilno", 1, "any", 2, 0));
    this.euRoutes.set("petrograd-wilno-1", new route("petrograd", "wilno", 1, "blue", 4, 0));
    this.euRoutes.set("smolensk-wilno-1", new route("smolensk", "wilno", 1, "yellow", 3, 0));
    this.euRoutes.set("bucuresti-budapest-1", new route("bucuresti", "budapest", 1, "any", 4, 0));
    this.euRoutes.set("bucuresti-sofia-1", new route("bucuresti", "sofia", 1, "any", 2, 0));
    this.euRoutes.set("constantinople-sofia-1", new route("constantinople", "sofia", 1, "blue", 3, 0));
    this.euRoutes.set("constantinople-smyrna-1", new route("constantinople", "smyrna", 1, "any", 2, 0));
    this.euRoutes.set("bucuresti-constantinople-1", new route("bucuresti", "constantinople", 1, "yellow", 3, 0));
    this.euRoutes.set("angora-smyrna-1", new route("angora", "smyrna", 1, "brown", 3, 0));
    this.euRoutes.set("angora-constantinople-1", new route("angora", "constantinople", 1, "any", 2, 0));
    this.euRoutes.set("constantinople-sevastopol-1", new route("constantinople", "sevastopol", 1, "any", 4, 2));
    this.euRoutes.set("bucuresti-sevastopol-1", new route("bucuresti", "sevastopol", 1, "white", 4, 0));
    this.euRoutes.set("bucuresti-kyiv-1", new route("bucuresti", "kyiv", 1, "any", 4, 0));
    this.euRoutes.set("kyiv-smolensk-1", new route("kyiv", "smolensk", 1, "red", 3, 0));
    this.euRoutes.set("moskva-smolensk-1", new route("moskva", "smolensk", 1, "brown", 2, 0));
    this.euRoutes.set("moskva-petrograd-1", new route("moskva", "petrograd", 1, "white", 4, 0));
    this.euRoutes.set("kharkov-moskva-1", new route("kharkov", "moskva", 1, "any", 4, 0));
    this.euRoutes.set("kharkov-kyiv-1", new route("kharkov", "kyiv", 1, "any", 4, 0));
    this.euRoutes.set("kharkov-rostov-1", new route("kharkov", "rostov", 1, "green", 2, 0));
    this.euRoutes.set("rostov-sevastopol-1", new route("rostov", "sevastopol", "any", 4, 0));
    this.euRoutes.set("rostov-sochi-1", new route("rostov", "sochi", 1, "any", 2, 0));
    this.euRoutes.set("sevastopol-sochi-1", new route("sevastopol", "sochi", "any", 2, 1));
    this.euRoutes.set("erzurum-sevastopol-1", new route("erzurum", "sevastopol", 1, "any", 4, 2));
    this.euRoutes.set("erzurum-sochi-1", new route("erzurum", "sochi", 1, "red", 3, 0));
    this.euRoutes.set("angora-erzurum-1", new route("angora", "erzurum", 1, "black", 3, 0));
};

game.prototype.setupEuDestinations = function () {
    this.euDesti.set("amsterdam-pamplona", new destination("eu", "amsterdam", "pamplona", 7));
    this.euDesti.set("amsterdam-wilno", new destination("eu", "amsterdam", "wilno", 12));
    this.euDesti.set("angora-kharkov", new destination("eu", "angora", "kharkov", 10));
    this.euDesti.set("athina-angora", new destination("eu", "athina", "angora", 5));
    this.euDesti.set("athina-wilno", new destination("eu", "athina", "wilno", 11));
    this.euDesti.set("barcelona-brussels", new destination("eu", "barcelona", "brussels", 8));
    this.euDesti.set("barcelona-munchen", new destination("eu", "barcelona", "munchen", 8));
    this.euDesti.set("berlin-bucuresti", new destination("eu", "berlin", "bucuresti", 8));
    this.euDesti.set("berlin-moskva", new destination("eu", "berlin", "moskva", 12));
    this.euDesti.set("berlin-roma", new destination("eu", "berlin", "roma", 9));
    this.euDesti.set("brest-marseille", new destination("eu", "brest", "marseille", 7));
    this.euDesti.set("brest-petrograd", new destination("eu", "brest", "petrograd", 20));
    this.euDesti.set("brest-venice", new destination("eu", "brest", "venice", 8));
    this.euDesti.set("brussels-danzig", new destination("eu", "brussels", "danzig", 9));
    this.euDesti.set("budapest-sofia", new destination("eu", "budapest", "sofia", 5));
    this.euDesti.set("cadiz-stockholm", new destination("eu", "cadiz", "stockholm", 21));
    this.euDesti.set("edinburgh-athina", new destination("eu", "edinburgh", "athina", 21));
    this.euDesti.set("edinburgh-paris", new destination("eu", "edinburgh", "paris", 7));
    this.euDesti.set("essen-kyiv", new destination("eu", "essen", "kyiv", 10));
    this.euDesti.set("frankfurt-kopenhagen", new destination("eu", "frankfurt", "kopenhagen", 5));
    this.euDesti.set("frankfurt-smolensk", new destination("eu", "frankfurt", "smolensk", 13));
    this.euDesti.set("kopenhagen-erzurum", new destination("eu", "kopenhagen", "erzurum", 21));
    this.euDesti.set("kyiv-petrograd", new destination("eu", "kyiv", "petrograd", 6));
    this.euDesti.set("kyiv-sochi", new destination("eu", "kyiv", "sochi", 8));
    this.euDesti.set("lissabon-danzig", new destination("eu", "lissabon", "danzig", 20));
    this.euDesti.set("londen-berlin", new destination("eu", "londen", "berlin", 7));
    this.euDesti.set("londen-wein", new destination("eu", "londen", "wein", 10));
    this.euDesti.set("madrid-dieppe", new destination("eu", "madrid", "dieppe", 8));
    this.euDesti.set("madrid-zurich", new destination("eu", "madrid", "zurich", 8));
    this.euDesti.set("marseille-essen", new destination("eu", "marseille", "essen", 8));
    this.euDesti.set("palermo-constantinople", new destination("eu", "palermo", "constantinople", 8));
    this.euDesti.set("palermo-moskva", new destination("eu", "palermo", "moskva", 20));
    this.euDesti.set("paris-wein", new destination("eu", "paris", "wein", 8));
    this.euDesti.set("paris-zagreb", new destination("eu", "paris", "zagreb", 7));
    this.euDesti.set("riga-bucuresti", new destination("eu", "riga", "bucuresti", 10));
    this.euDesti.set("rome-smyrna", new destination("eu", "rome", "smyrna", 8));
    this.euDesti.set("rostov-erzurum", new destination("eu", "rostov", "erzurum", 5));
    this.euDesti.set("sarajevo-sevastopol", new destination("eu", "sarajevo", "sevastopol", 8));
    this.euDesti.set("smolensk-rostov", new destination("eu", "smolensk", "rostov", 8));
    this.euDesti.set("sofia-smyrna", new destination("eu", "sofia", "smyrna", 5));
    this.euDesti.set("stockholm-wein", new destination("eu", "stockholm", "wein", 11));
    this.euDesti.set("venice-constantinople", new destination("eu", "venice", "constantinople", 10));
    this.euDesti.set("warsaw-smolensk", new destination("eu", "warsaw", "smolensk", 6));
    this.euDesti.set("zagreb-brindisi", new destination("eu", "zagreb", "brindisi", 6));
    this.euDesti.set("zurich-brindisi", new destination("eu", "zurich", "brindisi", 6));
    this.euDesti.set("zurich-budapest", new destination("eu", "zurich", "budapest", 6));

    this.euStack = shuffleArray(Array.from(this.euDesti));
}

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
            return {status: true, color: color, amount: routeRequirements.length, locos: 0};
        } else {
            if (color === routeRequirements.color) {
                return {status: true, color: color, amount: routeRequirements.length, locos: 0};
            } else {
                return {status: false};
            }
        }
    } else if ((this["player" + pid][color] + this["player" + pid].loco) >= routeRequirements.length) {
        if (routeRequirements.color === "any") {
            return {
                status: true,
                color: color,
                amount: this["player" + pid][color],
                locos: (routeRequirements.length - this["player" + pid][color])
            };
        } else {
            if (color === routeRequirements.color) {
                return {
                    status: true,
                    color: color,
                    amount: this["player" + pid][color],
                    locos: (routeRequirements.length - this["player" + pid][color])
                };
            } else {
                return {status: false};
            }
        }
    } else {
        return {status: false};
    }
};

game.prototype.playerDidSomething = function () {
    this.thingsDone++;
    if (this.thingsDone > 2) {
        this.nextPlayerRound();
    }
};

game.prototype.nextPlayerRound = function () {
    this.thingsDone = 0;
    let nextPlayer = this.currentRound + 1;
    if (this["player" + nextPlayer] !== null) {
        console.log("the next player does exist");
        let msg = messages.O_PLAYER_ROUND;
        msg.data = ++this.currentRound;
        this.sendToAll(msg);
    } else {
        console.log("the next player does not exist");
        let msg = messages.O_PLAYER_ROUND;
        msg.data = 0;
        this.sendToAll(msg);
        this.currentRound = 0;
    }
};

game.prototype.getEuDestination = function () {
    return this.euStack.pop();
}

function shuffleArray(array) {
    var m = array.length, t, i;

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
    console.log("A player claimed a route. We'll check if it is from Londen to Barcelona now!");
    console.log(checkContinuity(this["player" + playerID], "londen", "barcelona"));
}

function checkContinuity(player, stationA, stationB) {
    let map = player.routes;
    let visited = [];

    let recursion = function (startingStation, endingStation) {
        console.log("Recursion evoked from " + startingStation  +" to " + endingStation);
        let stationList = map.get(startingStation);
        if (stationList !== undefined) {
            console.log("All routes from " + startingStation + ": " + stationList.length);
            visited.push(startingStation);
            for (let i = 0; i < stationList.length; i++) {
                if (!visited.includes(stationList[i].stationA) || !visited.includes(stationList[i].stationB)) {
                    console.log("Checking " + stationList[i].stationA + " to " + stationList[i].stationB);
                    if (stationList[i].stationA === endingStation || stationList[i].stationB === endingStation) {
                        return true;
                    } else {
                        if (stationList[i].stationA === startingStation) {
                            return recursion(stationList[i].stationB, endingStation);
                        } else {
                            return recursion(stationList[i].stationA, endingStation);
                        }
                    }
                }
            }
        }
        return false;
    }
    return recursion(stationA, stationB);

}

module.exports = game;
