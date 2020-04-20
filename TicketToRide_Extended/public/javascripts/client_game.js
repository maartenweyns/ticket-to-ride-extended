var socket;
var playerID;

if (document.location.protocol === "https:" || document.location.protocol === "https:") {
    socket = new WebSocket("wss://" + location.host);
} else {
    socket = new WebSocket("ws://" + location.host);
}

(function setup() {
    document.getElementById("defaultOpen").click();

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("incomingMsg: " + JSON.stringify(incomingMsg));

        if (incomingMsg.type === Messages.T_PLAYER_NAME) {
            playerID = incomingMsg.data;
            promptName();
        }

        if (incomingMsg.type === Messages.T_OPEN_CARDS) {
            if (!incomingMsg.data.shuffle) {
                setOpenTickets(incomingMsg.data.cards);
            } else {
                shuffle(incomingMsg.data.cards);
            }
        }

        if (incomingMsg.type === Messages.T_NEW_OPEN_CARD) {
            replaceCard(incomingMsg.data.repCard, incomingMsg.data.newColor);
        }

        if (incomingMsg.type === Messages.T_REQUEST_TRAIN) {
            addCardToCollection(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_PLAYER_OVERVIEW) {
            addUser(incomingMsg.data);
        }
    };
})();

function promptName() {
    let name = prompt("Please enter your name:");
    let msg = Messages.O_PLAYER_NAME;
    msg.data = {pName: name, pID: playerID};
    socket.send(JSON.stringify(msg));
}

function addUser(users) {
    let userBox = document.getElementById("userBox");
    userBox.innerHTML = '';
    while(users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('div');
        let userBackdrop = document.createElement('img');
        userBackdrop.src = 'images/playerinformation/playerBackdrop/support-opponent-Human-Horizontal-' + user.color + '.png';
        userBackdrop.classList.add("playerBackdropImage");
        userEntry.classList.add("playerBackdrop");

        let playerName = document.createElement('p');
        playerName.innerText = user.name;
        playerName.classList.add("playerName");

        userEntry.append(userBackdrop);
        userEntry.append(playerName);
        userBox.prepend(userEntry);
    }
}
