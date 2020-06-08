const Game = require("../game");
const Player = require("../player");
var game;

describe("Tests Without Game Players", () => {
    beforeEach(() => {
        game = new Game("testgame");
    });

    test("Add Player Valid Name", () => {
        let playername = "John";
        let socketid = "anyid";

        let returned = game.addPlayer(playername, socketid);

        expect(returned).toBeTruthy();
        expect(game.amountOfPlayers).toBe(1);
        expect(game.isFull()).toBeFalsy();
    });

    test("Add Player Invalid Name", () => {
        let playername = "   ";
        let socketid = "anyid";

        let returned = game.addPlayer(playername, socketid);

        expect(returned).toBeFalsy();
        expect(game.amountOfPlayers).toBe(0);
        expect(game.isFull()).toBeFalsy();
    });

    test("Add Player Long Name", () => {
        let playername1 = "1234567890";
        let playername2 = "12345678901";
        let socketid = "anyid";

        let returned1 = game.addPlayer(playername1, socketid);
        let returned2 = game.addPlayer(playername2, socketid);

        expect(returned1).toBeTruthy();
        expect(returned2).toBeFalsy();
        expect(game.amountOfPlayers).toBe(1);
        expect(game.isFull()).toBeFalsy();
    });

    test("Add Player Game Full", () => {
        let playername = "John";
        let socketid = "anyid";

        let returnedarray = [];

        // Adding 8 players
        for (let i = 0; i < 8; i++) {
            returnedarray.push(game.addPlayer(playername, socketid));
        }
        // This player should not be able to join the game anymore
        let returned = game.addPlayer(playername, socketid);

        expect(returnedarray).toContain(true);
        expect(returnedarray).not.toContain(false);

        expect(returned).toBeFalsy();
        expect(game.isFull()).toBeTruthy();
    });
});
