const Utilities = require("./utilities");
const Node = require("./graph/node");
const Edge = require("./graph/edge");

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

// player.prototype.createRouteGraph = function () {
//     let nodes = new Map();

//     // Add all stations this user connects to to a map object
//     for (let routeID in this.routeIDs) {
//         let stations = routeID.split("-");
//         if (!nodes.has(stations[0])) {
//             nodes.set(stations[0], new Node(stations[0]));
//         }
//         if (!nodes.has(stations[1])) {
//             nodes.set(stations[1], new Node(stations[1]));
//         }
//     }

//     // Create edges for all routes this user has
//     for (let routeID in this.routeIDs) {
//         let stations = routeID.split("-");
//         let length = this.routes.get()

//         let stationA = nodes.get(stations[0]);
//         stationA.addEdge(stations[1], )
//     }
// }

player.prototype.findLongestRoute = function () {
    let longestRoute = 0;

    for (let routearray of this.routes.values()) {
        console.log('BEGIN');
        rlength = 0;
        lengthSinceDecision = 0;

        let visited = [];
        let stack = [];

        stack = [].concat(routearray);

        while (stack.length > 0) {
            let currentRoute = stack.pop();
            visited.push(currentRoute);
            rlength += currentRoute.length;
            lengthSinceDecision += currentRoute.length;

            console.log("Current route")
            console.log(currentRoute);

            added = 0;

            for (let nextRoute of this.routes.get(currentRoute.stationB)) {
                // console.log("Next Up");
                // console.log(nextRoute);
                if (!visited.includes(nextRoute)) {
                    added++;
                    stack = stack.concat([nextRoute]);
                    // console.log("Added");
                }
            }

            if (added === 0) {
                // We did not add any route to the stack. We will begin to go back
                if (rlength > longestRoute) {
                    longestRoute = rlength;
                }
                console.log("Backtracing... Current longest = " + longestRoute);
                rlength -= lengthSinceDecision;
                lengthSinceDecision = 0;
            } else if (added > 1) {
                console.log("Had to decide -> reset LSD")
                lengthSinceDecision = 0;
            }

            console.log("Stack")
            console.log(stack);

            // stack = stack.concat(this.routes.get(currentRoute.stationA));

            // console.log(stack);
            // console.log(rlength);
        }
    }

    return longestRoute;
};

module.exports = player;