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

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
