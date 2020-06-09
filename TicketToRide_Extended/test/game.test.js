const Game = require("../game");
const Player = require("../player");
var game;

beforeEach(() => {
    game = new Game("testgame");
});

describe("Tests Without Game Players", () => {
    test("Add Player Valid Name", () => {
        let playername = "John";
        let socketid = "anyid";

        let returned = game.addPlayer(playername, socketid);

        expect(returned).toEqual(expect.objectContaining({ status: true }));
        expect(game.amountOfPlayers).toBe(1);
        expect(game.player0).not.toBeUndefined();
        expect(game.player0.id).toBe(0);
        expect(game.isFull()).toBeFalsy();
    });

    test("Add Player Invalid Name", () => {
        let playername = "   ";
        let socketid = "anyid";

        let returned = game.addPlayer(playername, socketid);

        expect(returned).toEqual(expect.objectContaining({ status: false }));
        expect(game.amountOfPlayers).toBe(0);
        expect(game.isFull()).toBeFalsy();
    });

    test("Add Player Long Name", () => {
        let playername1 = "1234567890";
        let playername2 = "12345678901";
        let socketid = "anyid";

        let returned1 = game.addPlayer(playername1, socketid);
        let returned2 = game.addPlayer(playername2, socketid);

        expect(returned1).toEqual(expect.objectContaining({ status: true }));
        expect(returned2).toEqual(expect.objectContaining({ status: false }));
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

        expect(returned).toEqual(expect.objectContaining({ status: false }));
        expect(game.isFull()).toBeTruthy();
    });
});

describe("General Game Function Tests", () => {
    test("Check Need For Shuffle Test False", () => {
        game.openCards.Card0 = "blue";
        game.openCards.Card1 = "red";
        game.openCards.Card2 = "loco";
        game.openCards.Card3 = "loco";
        game.openCards.Card4 = "brown";

        let returned = game.checkNeedForShuffle();

        expect(returned).toBeFalsy();
    });

    test("Check Need For Shuffle Test True", () => {
        game.openCards.Card0 = "loco";
        game.openCards.Card1 = "red";
        game.openCards.Card2 = "loco";
        game.openCards.Card3 = "loco";
        game.openCards.Card4 = "brown";

        let returned = game.checkNeedForShuffle();

        expect(returned).toBeTruthy();
    });

    test("Get Route Requirements Eu Test", () => {
        let routeID = "marseille-pamplona-1";
        let expected = {
            color: "red",
            length: 4,
            locos: 0,
        };
        let returned = game.getRouteRequirements(routeID, "eu");

        expect(returned).toEqual(expected);
    });

    test("Get Route Requirements Us Test", () => {
        let routeID = "duluth-helena-1";
        let expected = {
            color: "brown",
            length: 6,
            locos: 0,
        };
        let returned = game.getRouteRequirements(routeID, "us");

        expect(returned).toEqual(expected);
    });

    test("Get Route Requirements Undefined Us Test", () => {
        let routeID = "marseille-pamplona-1";
        let returned = game.getRouteRequirements(routeID, "us");

        expect(returned).toEqual(undefined);
    });

    test("Get Route Requirements Undefined Eu Test", () => {
        let routeID = "duluth-helena-1";
        let returned = game.getRouteRequirements(routeID, "eu");

        expect(returned).toEqual(undefined);
    });
});

describe("Tests With Users In Game", () => {
    beforeEach(() => {
        game.addPlayer("John", "somesocketid");
        game.addPlayer("Lisa", "somesocketid");
    });

    describe("Eligibility EU True test", () => {
        beforeEach(() => {
            // Give the players some cards to play with :)
            game.player0.takeTrain("blue", false);
            game.player0.takeTrain("blue", false);
            game.player0.takeTrain("blue", false);
            game.player0.takeTrain("blue", false);
            game.player0.takeTrain("red", false);
            game.player0.takeTrain("brown", false);
            game.player0.takeTrain("loco", false);
        });

        test("Check Eligibility Eu True", () => {
            /*
            Define the route on which we will conduct the test. In this case: warsaw - wien
            Requirements are 4 blue cards, no locomotives

            Pardon the typo 'wein', this is a global game typo and I'm too lazy to fix it in
            the other parts of the game so just accept it :).
            I'll open a PR one day...
            Maybe..
            */
            let routeid = "warsaw-wein-1";

            // Execute the method and check if the player is able to 'afford' the route
            let returned = game.checkEligibility(0, "blue", routeid, "eu");
            expect(returned).toBeTruthy();
        });

        test("Check Eligibility Eu True Locomotive", () => {
            // Requirements are 2 red cards no locomotives
            let routeid = "brussels-paris-2";

            let returned = game.checkEligibility(0, "red", routeid, "eu");
            expect(returned).toBeTruthy();
        });

        test("Check Eligibility Eu False", () => {
            let routeid = "berlin-warsaw-1";

            let returned = game.checkEligibility(0, "purple", routeid, "eu");
            expect(returned).toBeFalsy();
        });
    });
});