(function (exports) {

    /**
     * Player to server: The card the player took.
     * @type {string}
     */
    exports.T_PLAYER_TOOK_OPEN_TRAIN = "PLAYER-TOOK-OPEN-TRAIN";
    exports.O_PLAYER_TOOK_OPEN_TRAIN = {
        type: exports.T_PLAYER_TOOK_OPEN_TRAIN,
        data: null
    };
    exports.S_PLAYER_TOOK_OPEN_TRAIN = JSON.stringify(exports.O_PLAYER_TOOK_OPEN_TRAIN);

    /**
     * Player to server: The name of the player.
     * Server to player: Ask the player's name.
     * @type {string}
     */
    exports.T_PLAYER_NAME = "PLAYER-NAME";
    exports.O_PLAYER_NAME = {
        type: exports.T_PLAYER_NAME,
        data: null
    };
    exports.S_PLAYER_NAME = JSON.stringify(exports.O_PLAYER_NAME);

    /**
     * Server to players: Send a list of all players in the game.
     * @type {string}
     */
    exports.T_PLAYER_OVERVIEW = "PLAYER-OVERVIEW";
    exports.O_PLAYER_OVERVIEW = {
        type: exports.T_PLAYER_OVERVIEW,
        data: null
    };
    exports.S_PLAYER_OVERVIEW = JSON.stringify(exports.O_PLAYER_OVERVIEW);

    /**
     * Server to players: Send a list of all players in the game.
     * @type {string}
     */
    exports.T_OPEN_CARDS = "OPEN-CARDS";
    exports.O_OPEN_CARDS = {
        type: exports.T_OPEN_CARDS,
        data: null
    };
    exports.S_OPEN_CARDS = JSON.stringify(exports.O_OPEN_CARDS);

    /**
     * Server to players: Send a new open card.
     * @type {string}
     */
    exports.T_NEW_OPEN_CARD = "NEW-OPEN-CARD";
    exports.O_NEW_OPEN_CARD = {
        type: exports.T_NEW_OPEN_CARD,
        data: null
    };
    exports.S_NEW_OPEN_CARD = JSON.stringify(exports.O_NEW_OPEN_CARD);

    /**
     * Player to server: Player requests closed train card
     * @type {string}
     */
    exports.T_REQUEST_TRAIN = "REQUEST-TRAIN";
    exports.O_REQUEST_TRAIN = {
        type: exports.T_REQUEST_TRAIN,
        data: null
    };
    exports.S_REQUEST_TRAIN = JSON.stringify(exports.O_REQUEST_TRAIN);

    /**
     * Player to server: Player requests route requirements
     * Server to player: Server sends route requirements
     * @type {string}
     */
    exports.T_ROUTE_REQ = "ROUTE-REQUIREMENTS";
    exports.O_ROUTE_REQ = {
        type: exports.T_ROUTE_REQ,
        data: null
    };
    exports.S_ROUTE_REQ = JSON.stringify(exports.O_ROUTE_REQ);

    /**
     * Player to server: Request a route claim with a provided color.
     * Server to player: Notify all players of the claimed route.
     * @type {string}
     */
    exports.T_ROUTE_CLAIM = "ROUTE-CLAIM";
    exports.O_ROUTE_CLAIM = {
        type: exports.T_ROUTE_CLAIM,
        data: null
    };
    exports.S_ROUTE_CLAIM = JSON.stringify(exports.O_ROUTE_CLAIM);

    /**
     * Player to server: Done with the round.
     * Server to player: Notify all players of the player having it's round
     * @type {string}
     */
    exports.T_PLAYER_ROUND = "PLAYER-ROUND";
    exports.O_PLAYER_ROUND = {
        type: exports.T_PLAYER_ROUND,
        data: null
    };
    exports.S_PLAYER_ROUND = JSON.stringify(exports.O_PLAYER_ROUND);

    /**
     * Player to server: I already was in the lobby! This is my player ID:
     * @type {string}
     */
    exports.T_PLAYER_EXISTING_ID = "PLAYER-EXISTING-ID";
    exports.O_PLAYER_EXISTING_ID = {
        type: exports.T_PLAYER_EXISTING_ID,
        data: null
    };
    exports.S_PLAYER_EXISTING_ID = JSON.stringify(exports.O_PLAYER_EXISTING_ID);

    /**
     * Player to server: Let's start the game!
     * Server to players: Let's get this game started!
     * @type {string}
     */
    exports.T_GAME_START = "START-GAME";
    exports.O_GAME_START = {
        type: exports.T_GAME_START,
        data: null
    };
    exports.S_GAME_START = JSON.stringify(exports.O_GAME_START);

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
