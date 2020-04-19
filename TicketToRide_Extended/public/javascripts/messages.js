(function (exports) {

    /**
     * Player to server: The card the player took.
     * @type {string}
     */
    exports.T_PLAYER_TOOK_TRAIN = "PLAYER-TOOK-TRAIN";
    exports.O_PLAYER_TOOK_TRAIN = {
        type: exports.T_PLAYER_TOOK_TRAIN,
        data: null
    };
    exports.S_PLAYER_TOOK_TRAIN = JSON.stringify(exports.O_PLAYER_TOOK_TRAIN);

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

})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
