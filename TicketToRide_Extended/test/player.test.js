const Player = require('../player');
var player;

beforeEach(() => {
    // Construct a player to test
    let pid = 0;
    let pname = 'John';
    let pcolor = 'blue';
    let psocketid = 'asocketid';

    player = new Player(pid, pname, pcolor, psocketid);
});

test('initial-values', () => {
    expect(player.numberOfTrains).toBe(50);
    expect(player.numberOfTrainCards).toBe(0);
    expect(player.numberOfRoutes).toBe(0);
    expect(player.numberOfStations).toBe(3);
});

test('initial-train-cards', () => {
    player.getInitialTrainCards();
    let sum = player.black + player.blue + player.brown + player.green + player.loco + player.purple + player.red + player.white + player.yellow;

    expect(player.numberOfTrainCards).toBe(4);
    expect(sum).toBe(4);
});

test('take-train-closed', () => {
    let returned1 = player.takeTrain('blue', false);
    let returned2 = player.takeTrain('loco', false);

    expect(returned1).toBe(1);
    expect(returned2).toBe(1);

    expect(player.blue).toBe(1);
    expect(player.loco).toBe(1);
    expect(player.numberOfTrainCards).toBe(2);
});

test('take-train-open', () => {
    let returned = player.takeTrain('loco', true);
    let sum = player.black + player.blue + player.brown + player.green + player.loco + player.purple + player.red + player.white + player.yellow;

    expect(returned).toBe(1);

    expect(player.loco).not.toBe(0);
    expect(player.numberOfTrainCards).toBe(2);
    expect(sum).toBe(2);
});

test('take-train-invalid', () => {
    let returned = player.takeTrain('orange', true);
    let sum = player.black + player.blue + player.brown + player.green + player.loco + player.purple + player.red + player.white + player.yellow;

    expect(returned).toBe(-1);
    expect(player.numberOfTrainCards).toBe(0);
    expect(sum).toBe(0);
});

test('get-train-cards', () => {
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
        loco: 6
    };

    expect(player.getTrainCards().toString()).toBe(expected.toString());
});