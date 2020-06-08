const Player = require("../player");
var player;

beforeEach(() => {
    // Construct a player to test
    let pid = 0;
    let pname = "John";
    let pcolor = "blue";
    let psocketid = "asocketid";

    player = new Player(pid, pname, pcolor, psocketid);
});

test("Initial Values", () => {
    expect(player.numberOfTrains).toBe(50);
    expect(player.numberOfTrainCards).toBe(0);
    expect(player.numberOfRoutes).toBe(0);
    expect(player.numberOfStations).toBe(3);
});

test("Initial Traincards", () => {
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

test("Take Closed Train", () => {
    let returned1 = player.takeTrain("blue", false);
    let returned2 = player.takeTrain("loco", false);

    expect(returned1).toBe(true);
    expect(returned2).toBe(true);

    expect(player.blue).toBe(1);
    expect(player.loco).toBe(1);
    expect(player.numberOfTrainCards).toBe(2);
});

test("Take Open Train", () => {
    let returned = player.takeTrain("loco", true);
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

test("Take Train Invalid", () => {
    let returned = player.takeTrain("orange", true);
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

test("Get Train Cards", () => {
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

test("Check Eligibility True", () => {
    // Give the player some trainCards
    player.blue = 3;
    player.loco = 2;
    player.green = 3;
    player.numberOfTrainCards = 8;

    // Make a routeRequirements object
    let routeRequirements = {
        color: "blue",
        length: 3,
        locos: 0,
    };

    // Check if the player can put said route using his blue cards
    let returned = player.checkEligibility("blue", routeRequirements);

    expect(returned).toBe(true);
    expect(player.blue).toBe(0);
    expect(player.loco).toBe(2);
    expect(player.green).toBe(3);
    expect(player.numberOfTrainCards).toBe(5);
    expect(player.numberOfTrains).toBe(47);
    expect(player.score).toBe(4);
});

test("Check Eligibility True Locomotives", () => {
    // Give the player some trainCards
    player.blue = 3;
    player.loco = 2;
    player.green = 3;
    player.numberOfTrainCards = 8;

    // Make a routeRequirements object
    let routeRequirements = {
        color: "blue",
        length: 4,
        locos: 0,
    };

    // Check if the player can put said route using his blue cards
    let returned = player.checkEligibility("blue", routeRequirements);

    expect(returned).toBe(true);
    expect(player.blue).toBe(0);
    expect(player.loco).toBe(1);
    expect(player.green).toBe(3);
    expect(player.numberOfTrainCards).toBe(4);
    expect(player.numberOfTrains).toBe(46);
    expect(player.score).toBe(7);
});

test("Check Eligibility False", () => {
    // Give the player some trainCards
    player.blue = 3;
    player.loco = 1;
    player.green = 3;
    player.numberOfTrainCards = 8;

    // Make a routeRequirements object
    let routeRequirements = {
        color: "blue",
        length: 5,
        locos: 0,
    };

    // Check if the player can put said route using his blue cards
    let returned = player.checkEligibility("blue", routeRequirements);

    expect(returned).toBe(false);
    expect(player.blue).toBe(3);
    expect(player.loco).toBe(1);
    expect(player.green).toBe(3);
    expect(player.numberOfTrainCards).toBe(8);
    expect(player.numberOfTrains).toBe(50);
    expect(player.score).toBe(0);
});

test("Check Eligibility Not Enough Trains", () => {
    // Give the player some trainCards
    player.blue = 6;
    player.loco = 1;
    player.green = 3;
    player.numberOfTrainCards = 10;

    // Update the amount of trains to be 5
    player.numberOfTrains = 5;

    // ! This situation should never happen in real life, as the player now has more cards than trains.

    // Make a routeRequirements object
    let routeRequirements = {
        color: "blue",
        length: 6,
        locos: 0,
    };

    // Check if the player can put said route using his blue cards
    let returned = player.checkEligibility("blue", routeRequirements);

    expect(returned).toBe(false);
    expect(player.blue).toBe(6);
    expect(player.loco).toBe(1);
    expect(player.green).toBe(3);
    expect(player.numberOfTrainCards).toBe(10);
    expect(player.numberOfTrains).toBe(5);
    expect(player.score).toBe(0);
});
