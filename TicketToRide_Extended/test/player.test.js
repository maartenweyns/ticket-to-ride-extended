const Player = require('../player');
const Route = require('../route');
var player;

beforeEach(() => {
    // Construct a player to test
    let pid = 0;
    let pname = 'John';
    let pcolor = 'blue';
    let psocketid = 'asocketid';

    player = new Player(pid, pname, pcolor, psocketid, 50);
});

test('Initial Values', () => {
    expect(player.numberOfTrains).toBe(50);
    expect(player.numberOfTrainCards).toBe(0);
    expect(player.numberOfRoutes).toBe(0);
    expect(player.numberOfStations).toBe(3);
});

test('Initial Traincards', () => {
    player.getInitialTrainCards();
    let sum =
        player.black +
        player.blue +
        player.brown +
        player.green +
        player.loco +
        player.purple +
        player.red +
        player.white +
        player.yellow;

    expect(player.numberOfTrainCards).toBe(4);
    expect(sum).toBe(4);
});

test('Take Closed Train', () => {
    let returned1 = player.takeTrain('blue', false);
    let returned2 = player.takeTrain('loco', false);

    expect(returned1).toBe(true);
    expect(returned2).toBe(true);

    expect(player.blue).toBe(1);
    expect(player.loco).toBe(1);
    expect(player.numberOfTrainCards).toBe(2);
});

test('Take Open Train', () => {
    let returned = player.takeTrain('blue', true);
    let sum =
        player.black +
        player.blue +
        player.brown +
        player.green +
        player.loco +
        player.purple +
        player.red +
        player.white +
        player.yellow;

    expect(returned).toBe(true);

    expect(player.blue).toBe(1);
    expect(player.numberOfTrainCards).toBe(1);
    expect(sum).toBe(1);
});

test('Take Open Train Locomotive', () => {
    let returned = player.takeTrain('loco', true);
    let sum =
        player.black +
        player.blue +
        player.brown +
        player.green +
        player.loco +
        player.purple +
        player.red +
        player.white +
        player.yellow;

    expect(returned).toBe(true);

    expect(player.loco).not.toBe(0);
    expect(player.numberOfTrainCards).toBe(2);
    expect(sum).toBe(2);
});

test('Take Train Invalid', () => {
    let returned = player.takeTrain('orange', true);
    let sum =
        player.black +
        player.blue +
        player.brown +
        player.green +
        player.loco +
        player.purple +
        player.red +
        player.white +
        player.yellow;

    expect(returned).toBe(false);
    expect(player.numberOfTrainCards).toBe(0);
    expect(sum).toBe(0);
});

test('Get Train Cards', () => {
    player.blue = 2;
    player.red = 5;
    player.green = 2;
    player.loco = 6;

    let expected = {
        black: 0,
        blue: 2,
        brown: 0,
        green: 2,
        purple: 0,
        red: 5,
        white: 0,
        yellow: 0,
        loco: 6,
    };

    expect(player.getTrainCards().toString()).toBe(expected.toString());
});

test('Player Has Route Test True', () => {
    player.routeIDs.push("brussels-paris-1");
    expect(player.hasRoute("brussels-paris-2")).toBeTruthy();
});

test('Player Has Route Test False', () => {
    player.routeIDs.push("brussels-paris-1");
    expect(player.hasRoute("brussels-frankfurt-1")).toBeFalsy();
});

describe('Eligibility Tests', () => {
    beforeEach(() => {
        player.blue = 3;
        player.loco = 2;
        player.green = 3;
        player.numberOfTrainCards = 8;
    });

    test('Check Eligibility True', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 3,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBe(true);
        expect(player.blue).toBe(0);
        expect(player.loco).toBe(2);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(5);
        expect(player.numberOfTrains).toBe(47);
        expect(player.score).toBe(4);
    });
    
    test('Check Eligibility True Any Color', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'any',
            length: 3,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBe(true);
        expect(player.blue).toBe(0);
        expect(player.loco).toBe(2);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(5);
        expect(player.numberOfTrains).toBe(47);
        expect(player.score).toBe(4);
    });

    test('Check Eligibility True Paying With Locomotives', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 2,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('loco', routeRequirements);
    
        expect(returned).toBe(true);
        expect(player.blue).toBe(3);
        expect(player.loco).toBe(0);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(6);
        expect(player.numberOfTrains).toBe(48);
        expect(player.score).toBe(2);
    });

    test('Check Eligibility False But Enough Cards', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 3,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('green', routeRequirements);
    
        expect(returned).toBe(false);
        expect(player.blue).toBe(3);
        expect(player.loco).toBe(2);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(8);
        expect(player.numberOfTrains).toBe(50);
        expect(player.score).toBe(0);
    });

    test('Check Eligibility False Loco But Enough Cards', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 4,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('green', routeRequirements);
    
        expect(returned).toBe(false);
        expect(player.blue).toBe(3);
        expect(player.loco).toBe(2);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(8);
        expect(player.numberOfTrains).toBe(50);
        expect(player.score).toBe(0);
    });
    
    test('Check Eligibility True Locomotives', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 4,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBe(true);
        expect(player.blue).toBe(0);
        expect(player.loco).toBe(1);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(4);
        expect(player.numberOfTrains).toBe(46);
        expect(player.score).toBe(7);
    });
    
    test('Check Eligibility False', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 6,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBe(false);
        expect(player.blue).toBe(3);
        expect(player.loco).toBe(2);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(8);
        expect(player.numberOfTrains).toBe(50);
        expect(player.score).toBe(0);
    });
    
    test('Check Eligibility Not Enough Trains', () => {
        // Update the amount of trains to be 5
        player.numberOfTrains = 5;
    
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 6,
            locos: 0,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBe(false);
        expect(player.blue).toBe(3);
        expect(player.loco).toBe(2);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(8);
        expect(player.numberOfTrains).toBe(5);
        expect(player.score).toBe(0);
    });

    test('Check Eligibility True Required Locomotives', () => {

        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 4,
            locos: 2,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBeTruthy();
        expect(player.blue).toBe(1);
        expect(player.loco).toBe(0);
        expect(player.green).toBe(3);
        expect(player.numberOfTrainCards).toBe(4);
        expect(player.numberOfTrains).toBe(46);
        expect(player.score).toBe(7);
    });

    test('Check Eligibility False Required Locomotives', () => {
        // Make a routeRequirements object
        let routeRequirements = {
            color: 'blue',
            length: 4,
            locos: 3,
        };
    
        // Check if the player can put said route using his blue cards
        let returned = player.checkEligibility('blue', routeRequirements);
    
        expect(returned).toBeFalsy();
    });
});

test('Get Player Properties', () => {
    // Give the player some properties
    player.blue = 5;
    player.numberOftrainCards = 5;
    player.numberOfRoutes = 2;
    player.score = 26;

    let expected = {
        id: 0,
        name: 'John',
        score: 26,
        color: 'blue',
        numberOfTrains: 50,
        numberOfTrainCards: 5,
        numberOfRoutes: 2,
        numberOfStations: 3
    };

    let returned = player.getPlayerProperties();

    expect(returned.toString()).toBe(expected.toString());
});

test('Update Websocket Undefined', () => {
    let newSocket = undefined;

    let returned = player.updatewebsocket(newSocket);
    expect(returned).toBeFalsy();
});


test('Update Websocket Undefined', () => {
    let newSocket = {};

    let returned = player.updatewebsocket(newSocket);
    expect(returned).toBeTruthy();
});

test('Player Is Ready False', () => {
    let returned = player.isReady();
    expect(returned).toBeFalsy();
});

test('Player Is Ready True', () => {
    player.ready = true;

    let returned = player.isReady();
    expect(returned).toBeTruthy();
});

test('Player Set Ready Invalid', () => {
    let returned1 = player.setReady('hehe');
    let returned2 = player.isReady();
    expect(returned1).toBeFalsy();
    expect(returned2).toBeFalsy();
});

test('Player Set Ready Valid True', () => {
    let returned1 = player.setReady(true);
    let returned2 = player.isReady();
    expect(returned1).toBeTruthy();
    expect(returned2).toBeTruthy();
});

test('Player Set Ready Valid False', () => {
    let returned1 = player.setReady(false);
    let returned2 = player.isReady();
    expect(returned1).toBeTruthy();
    expect(returned2).toBeFalsy();
});

test('Player Longest Route single Route', () => {
    let route = new Route("a", "b", 1, "blue", 3, 0);
    let routearray = [];
    routearray.push(route);
    player.routes.set('a', routearray);
    player.routes.set('b', routearray);

    let returned = player.findLongestRoute();

    expect(returned).toBe(3);
});

test('Player Longest Route two Routes', () => {
    let route = new Route("a", "b", 1, "blue", 3, 0);
    let route2 = new Route("b", "c", 1, "blue", 4, 0);
    player.routes.set('a', [route]);
    player.routes.set('b', [route, route2]);
    player.routes.set('c', [route2])

    let returned = player.findLongestRoute();

    expect(returned).toBe(7);
});

test('Player Longest Route four Routes', () => {
    let route = new Route("a", "b", 1, "blue", 3, 0);
    let route3 = new Route("b", "d", 1, "blue", 4, 0);
    let route4 = new Route("d", "e", 1, "blue", 2, 0);
    let route2 = new Route("b", "c", 1, "blue", 4, 0);

    player.routes.set('a', [route]);
    player.routes.set('b', [route, route3, route2]);
    player.routes.set('c', [route2]);
    player.routes.set('d', [route3, route4])
    player.routes.set('e', [route4]);

    let returned = player.findLongestRoute();

    expect(returned).toBe(9);
});

test('Player Longest Route Complicated Variant 1', () => {
    let route1 = new Route("a", "b", 1, "blue", 2, 0);
    let route2 = new Route("b", "c", 1, "blue", 1, 0);
    let route3 = new Route("b", "d", 1, "blue", 4, 0);
    let route4 = new Route("c", "d", 1, "blue", 2, 0);
    let route5 = new Route("c", "e", 1, "blue", 3, 0);
    let route6 = new Route("f", "g", 1, "blue", 5, 0);
    let route7 = new Route("f", "h", 1, "blue", 2, 0);

    player.routes.set('a', [route1]);
    player.routes.set('b', [route1, route2, route3]);
    player.routes.set('c', [route2, route4, route5]);
    player.routes.set('d', [route3, route4]);
    player.routes.set('e', [route5]);
    player.routes.set('f', [route6, route7]);
    player.routes.set('g', [route6]);
    player.routes.set('h', [route7]);

    let returned = player.findLongestRoute();

    expect(returned).toBe(11);
});

test('Player Longest Route Complicated Variant 2', () => {
    let route1 = new Route("a", "b", 1, "blue", 2, 0);
    let route2 = new Route("b", "c", 1, "blue", 1, 0);
    let route3 = new Route("b", "d", 1, "blue", 4, 0);
    let route4 = new Route("c", "d", 1, "blue", 2, 0);
    let route5 = new Route("c", "e", 1, "blue", 3, 0);
    let route6 = new Route("f", "g", 1, "blue", 5, 0);
    let route7 = new Route("f", "h", 1, "blue", 8, 0);

    player.routes.set('a', [route1]);
    player.routes.set('b', [route1, route2, route3]);
    player.routes.set('c', [route2, route4, route5]);
    player.routes.set('d', [route3, route4]);
    player.routes.set('e', [route5]);
    player.routes.set('f', [route6, route7]);
    player.routes.set('g', [route6]);
    player.routes.set('h', [route7]);

    let returned = player.findLongestRoute();

    expect(returned).toBe(13);
});