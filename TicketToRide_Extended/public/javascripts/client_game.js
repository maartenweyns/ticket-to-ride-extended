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
        userEntry.classList.add("playerBackdrop");

        let userBackdrop = document.createElement('img');
        userBackdrop.src = 'images/playerinformation/playerBackdrop/support-opponent-Human-Horizontal-' + user.color + '.png';
        userBackdrop.classList.add("playerBackdropImage");

        let playerName = document.createElement('p');
        playerName.innerText = user.name;
        playerName.classList.add("playerName");

        let numberOfCarts = document.createElement('div');
        numberOfCarts.classList.add("numberOfCarts");
        let numberOfCartsBg = document.createElement('img');
        numberOfCartsBg.src = "images/playerInformation/wagons/player-train-number-Off.png";
        let numberOfCartsText = document.createElement('p');
        numberOfCartsText.classList.add("numberOfCartsText");
        numberOfCartsText.innerText = user.numberOfTrains;

        let numberOfTrainCards = document.createElement('div');
        numberOfTrainCards.classList.add("numberOfTrainCards");
        let numberOfTrainCardsImg = document.createElement('img');
        numberOfTrainCardsImg.src = "images/playerInformation/smallCards/wagons.png";
        let numberOfTrainCardsText = document.createElement('p');
        numberOfTrainCardsText.classList.add("numberOfTrainCardsText");
        numberOfTrainCardsText.innerText = user.numberOfTrainCards;

        let numberOfRoutes = document.createElement('div');
        numberOfRoutes.classList.add("numberOfRouteCards");
        let numberOfRoutesImg = document.createElement('img');
        numberOfRoutesImg.src = "images/playerInformation/smallCards/routes.png";
        let numberOfRoutesText = document.createElement('p');
        numberOfRoutesText.classList.add("numberOfRouteCardsText");
        numberOfRoutesText.innerText = user.numberOfRoutes;

        numberOfCarts.append(numberOfCartsBg, numberOfCartsText);
        numberOfTrainCards.append(numberOfTrainCardsImg, numberOfTrainCardsText);
        numberOfRoutes.append(numberOfRoutesImg, numberOfRoutesText);
        userEntry.append(userBackdrop);
        userEntry.append(playerName);
        userEntry.append(numberOfCarts);
        userEntry.append(numberOfTrainCards);
        userEntry.append(numberOfRoutes);
        userBox.prepend(userEntry);
    }
}
