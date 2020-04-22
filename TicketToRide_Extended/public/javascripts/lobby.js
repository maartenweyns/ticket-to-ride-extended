var socket;
var playerID;

if (document.location.protocol === "https:" || document.location.protocol === "https:") {
    socket = new WebSocket("wss://" + location.host);
} else {
    socket = new WebSocket("ws://" + location.host);
}

(function setup() {
    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("incomingMsg: " + JSON.stringify(incomingMsg));

        if (incomingMsg.type === Messages.T_PLAYER_NAME) {
            playerID = incomingMsg.data;

            let expires = new Date();
            expires.setDate(expires.getDate() + 1);
            document.cookie = "playerID=" + playerID + "; expires=" + expires;
            promptName();
        }

        if (incomingMsg.type === Messages.T_PLAYER_OVERVIEW) {
            addUsers(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_GAME_START) {
            window.location.pathname = '/play'
        }
    };
})();

function promptName() {
    let name = prompt("Hi, welcome to Ticket To Ride XTended! For starters, please enter your name below! It will be used to identify you during the game and will be shown to your opponents!");
    let msg = Messages.O_PLAYER_NAME;
    msg.data = {pName: name, pID: playerID};
    socket.send(JSON.stringify(msg));
}

function addUsers(users) {
    let userBox = document.getElementsByClassName("circles")[0];
    userBox.innerHTML = '';
    while (users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('li');
        userEntry.innerText = user.name;
        userBox.prepend(userEntry);
    }
}

function startGame() {
    let msg = Messages.O_GAME_START;
    socket.send(JSON.stringify(msg));
}
