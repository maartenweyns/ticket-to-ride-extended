const Game = require("../game");
const Route = require("../route");
var game;

describe("Tests with EU and US", () => {
    beforeEach(() => {
        game = new Game("testgame", true, true, 50);
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

        test("Merge Destinations Test", () => {
            let beforeMergeEu = game.euStack.length;
            let beforeMergeUs = game.usStack.length;

            expect(game.longStack).toHaveLength(10);

            game.mergeAllDestinations();

            expect(game.euStack).toHaveLength(beforeMergeEu + 6);
            expect(game.usStack).toHaveLength(beforeMergeUs + 4);
            expect(game.longStack).toHaveLength(0);
        });

        test("Get Game Options Test", () => {
            let expected = {eu: true, us: true, trains: 50};

            let returned = game.getOptions();

            expect(returned).toEqual(expected);
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

        test("Player Update SocketID Valid", () => {
            let newid = "somenewsocketid";

            let returned = game.updatePlayerSocket(0, newid);

            expect(returned).toBeTruthy();
            expect(game.player0.socketID).toBe(newid);
        });

        describe("Players Ready Tests", () => {
            test("All players ready false none", () => {
                let returned = game.allPlayersReady();
                expect(returned).toBeFalsy();
            });

            test("All Players Ready False One Ready", () => {
                game.player0.setReady(true);
                let returned = game.allPlayersReady();
                expect(returned).toBeFalsy();
            });

            test("All Players Ready True", () => {
                game.player0.setReady(true);
                game.player1.setReady(true);
                let returned = game.allPlayersReady();
                expect(returned).toBeTruthy();
            });
        });

        describe("Check Eligibility Tests", () => {
            beforeEach(() => {
                // Give the players some cards to play with :)
                game.player0.takeTrain("blue", false);
                game.player0.takeTrain("blue", false);
                game.player0.takeTrain("blue", false);
                game.player0.takeTrain("blue", false);
                game.player0.takeTrain("red", false);
                game.player0.takeTrain("red", false);
                game.player0.takeTrain("brown", false);
                game.player0.takeTrain("loco", false);
            });

            test("Get Existing Player Train Cards", () => {
                let expected = {
                    black: 0,
                    blue: 4,
                    brown: 1,
                    green: 0,
                    purple: 0,
                    red: 2,
                    white: 0,
                    yellow: 0,
                    loco: 1,
                };

                let returned = game.getPlayerTrainCards(0);
                expect(returned).toEqual(expected);
            });

            test("Get Non-Existing Player Train Cards", () => {
                let returned = game.getPlayerTrainCards(2);
                expect(returned).toBeFalsy();
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
                expect(game.claimedRoutes).toContain("warsaw-wein-1");
            });

            test("Check Eligibility Eu True Locomotive", () => {
                // Requirements are 2 red cards no locomotives
                let routeid = "brussels-paris-2";

                let returned = game.checkEligibility(0, "red", routeid, "eu");
                expect(returned).toBeTruthy();
                expect(game.claimedRoutes).toContain("brussels-paris-2");
            });

            test("Check Eligibility Double Route Eu False", () => {
                // Requirements are 2 red cards no locomotives
                let routeid = "brussels-paris-2";

                let returned = game.checkEligibility(0, "red", routeid, "eu");
                expect(returned).toBeTruthy();
                expect(game.claimedRoutes).toContain("brussels-paris-2");

                let routeid2 = "brussels-paris-1";

                let returned2 = game.checkEligibility(0, "red", routeid2, "eu");
                expect(returned2).toBeFalsy();
                expect(game.claimedRoutes).not.toContain("brussels-paris-1");
            });


            test("Check Eligibility Eu False", () => {
                let routeid = "berlin-warsaw-1";

                let returned = game.checkEligibility(0, "purple", routeid, "eu");
                expect(returned).toBeFalsy();
            });

            test("Check Eligibility Nonexisting Route", () => {
                let routeid = "this-does-not-exist";

                let returned = game.checkEligibility(0, "purple", routeid, "eu");
                expect(returned).toBeFalsy();
            });

            test("Check Eligibility Already Claimed Route", () => {
                // Requirements are 2 red cards no locomotives
                let routeid = "brussels-paris-2";

                let returned1 = game.checkEligibility(0, "red", routeid, "eu");
                expect(returned1).toBeTruthy();

                let returned2 = game.checkEligibility(0, "red", routeid, "eu");
                expect(returned2).toBeFalsy();
            });
        });

        test("Calculate Score Test", () => {
            let expected = [
                {
                    id: 0,
                    score: 0,
                    color: "blue",
                    destinations: [],
                    completedDestinations: [],
                    longestTrain: true,
                    stations: 3,
                },
                {
                    id: 1,
                    score: 0,
                    color: "brightyellow",
                    destinations: [],
                    completedDestinations: [],
                    longestTrain: true,
                    stations: 3,
                },
            ];

            let returned = game.calculateScore();

            expect(returned).toEqual(expected);
        });
    });

    describe("Tests with Users with Routes In Game", () => {
        beforeEach(() => {
            game.addPlayer("John", "somesocketid");
            game.addPlayer("Lisa", "somesocketid");

            let route1 = new Route("a", "b", 1, "blue", 2, 0);
            let route2 = new Route("b", "c", 1, "blue", 1, 0);
            let route3 = new Route("b", "d", 1, "blue", 4, 0);
            let route4 = new Route("c", "d", 1, "blue", 2, 0);
            let route5 = new Route("c", "e", 1, "blue", 3, 0);
            let route6 = new Route("f", "g", 1, "blue", 5, 0);
            let route7 = new Route("f", "h", 1, "blue", 2, 0);

            game.userClaimedRoute(0, route1);
            game.userClaimedRoute(0, route2);
            game.userClaimedRoute(0, route3);
            game.userClaimedRoute(0, route4);
            game.userClaimedRoute(1, route4);
            game.userClaimedRoute(1, route5);
            game.userClaimedRoute(1, route6);
            game.userClaimedRoute(1, route7);
            game.userClaimedRoute(1, route2);
        });

        test("Test Player 0 Longest Train", () => {
            expect(game.getPlayersWithLongestTrain()).toEqual([0]);
        });

        test("Test Players Equal Longest Train", () => {
            game.userClaimedRoute(1, new Route("b", "d", 1, "blue", 3, 0));
            
            expect(game.getPlayersWithLongestTrain()).toEqual([0, 1]);
        });

    });
});
