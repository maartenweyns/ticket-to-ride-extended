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

player.prototype.hasRoute = function (routeID) {
    for (let rid of this.routeIDs) {
        if (rid.slice(0, rid.length - 2) === routeID.slice(0, routeID.length - 2)) {
            return true;
        }
    }
    return false;
}

player.prototype.checkEligibility = function (uColor, routeRequirements, rid) {
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
            this.routeClaimed(points, "loco", rLength, 0, rid);
            return true;
        } else {
            // The player does not have enough locomotives to pay this route
            return false;
        }
    }
    if (rColor === "any" || uColor == rColor) {
        // This is a grey route or the selected color of the user matches the color of the route
        if (lRequired === 0) {
            // The route does not require locomotives
            if (this[uColor] >= rLength) {
                // The route can be claimed using just the colored cards
                this.routeClaimed(points, uColor, rLength, 0, rid);
                return true;
            } else if (this[uColor] + this.loco >= rLength) {
                // The player is using additional locomotives for this route
                let lUsed = rLength - this[uColor];
                this.routeClaimed(points, uColor, this[uColor], lUsed, rid);
                return true;
            } else {
                return false;
            }
        } else {
            // The route requires locomotives
            if (this[uColor] >= rLength - lRequired && this.loco >= lRequired) {
                // The player has enough color cards and locomotives
                this.routeClaimed(points, uColor, rLength - lRequired, lRequired, rid);
                return true;
            } else if (this[uColor] + this.loco >= rLength && this.loco - (rLength - lRequired - this[uColor]) >= lRequired) {
                // The player uses locomotives for the non-locomotive part as well
                this.routeClaimed(points, uColor, this[uColor], lRequired + rLength - lRequired - this[uColor], rid);
                return;
            } else {
                return false;
            }
        }
        
    }
    // All cases fail, the player cannot claim the route
    return false;
};

player.prototype.routeClaimed = function (points, color, amount, locos, id) {
    this.score += points;
    this[color] -= amount;
    this.loco -= locos;
    this.routeIDs.push(id);

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

player.prototype.findLongestRoute = function () {
    let longestRoute = 0;

    let looseRoutes = [];
    for (let station of this.routes.keys()) {
        if (this.routes.get(station).length === 1) {
            looseRoutes.push(this.routes.get(station)[0]);
        }
    }

    if (looseRoutes.length === 0) {
        for (routeArray of this.routes.values()) {
            looseRoutes = looseRoutes.concat(routeArray);
        }
    }

    for (let route of looseRoutes) {
        // console.log('BEGIN');
        let rlength = 0;
        let lengthSinceDecision = 0;

        let countFrom = route.stationA;
        if (this.routes.get(route.stationA).length === 1) {
            countFrom = route.stationB;
        }

        let visited = [];
        let stack = [route];

        while (stack.length > 0) {
            let currentRoute = stack.pop();

            if (!visited.includes(currentRoute)) {
                visited.push(currentRoute);
                rlength += currentRoute.length;
                lengthSinceDecision += currentRoute.length;

                // console.log("Current route")
                // console.log(currentRoute);

                // console.log("Count from: " + countFrom);

                goTo = currentRoute.stationA;

                let added = 0;

                for (let nextRoute of this.routes.get(countFrom)) {
                    if (!visited.includes(nextRoute)) {
                        added++;
                        stack.push(nextRoute);
                        if (nextRoute.stationA === countFrom) {
                            goTo = nextRoute.stationB;
                        } else {
                            goTo = nextRoute.stationA;
                        }
                    }
                }

                countFrom = goTo;

                if (added === 0) {
                    // We did not add any route to the stack. We will begin to go back
                    if (rlength > longestRoute) {
                        longestRoute = rlength;
                    }
                    // console.log("Going back. Current longest = " + longestRoute);
                    rlength -= lengthSinceDecision;
                    lengthSinceDecision = 0;
                } else if (added > 1) {
                    // console.log("Resetting LsD. Added was greater than 1");    
                    lengthSinceDecision = 0;
                }

                // console.log("Stack")
                // console.log(stack);

                // console.log("LsD");
                // console.log(lengthSinceDecision);
            }
        }
    }

    return longestRoute;
};

module.exports = player;