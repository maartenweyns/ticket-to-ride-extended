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
            addUsers(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_ROUTE_REQ) {
            alert(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_ROUTE_CLAIM) {
            if (incomingMsg.data.status === true) {
                let imageLocation = document.getElementById("Europe");
                let linkToTrainsToAdd = "images/trainsOnMap/eu/" + incomingMsg.data.pcol + "/" + incomingMsg.data.route + ".png";

                let carts = document.createElement('img');
                carts.src = linkToTrainsToAdd;
                carts.classList.add("carts");
                imageLocation.append(carts);
            } else {
                if (incomingMsg.data.pid === playerID) {
                    let audio = new Audio("sounds/buzz4.ogg");
                    audio.play();
                }
            }
        }
    };
})();

function promptName() {
    let name = prompt("Please enter your name:");
    let msg = Messages.O_PLAYER_NAME;
    msg.data = {pName: name, pID: playerID};
    socket.send(JSON.stringify(msg));
}

function addUsers(users) {
    let userBox = document.getElementById("userBox");
    userBox.innerHTML = '';
    while(users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('div');
        userEntry.classList.add("playerBackdrop");

        let userBackdrop = document.createElement('img');
        userBackdrop.src = 'images/playerInformation/playerBackdrop/support-opponent-Human-Horizontal-' + user.color + '.png';
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

function requestRouteRequirements(segmentTitle) {
    let msg = Messages.O_ROUTE_REQ;
    msg.data = {pid: playerID, route: segmentTitle};
    socket.send(JSON.stringify(msg));
}

function activateTrainCards(color) {
    let cardItem = document.getElementById(color);
    if (cardItem.children[0].classList.contains("activatedCard")) {
        cardItem.children[0].classList.remove("activatedCard");
    } else {
        let cardPile = document.getElementById("ownCardContainer");
        for (let i = 0; i < cardPile.children.length; i++) {
            cardPile.children[i].children[0].classList.remove("activatedCard");
        }
        cardItem.children[0].classList.add("activatedCard");
    }
}

function claimEuRoute(routeID) {
    if (document.getElementsByClassName("activatedCard")[0] !== undefined) {
        let color = document.getElementsByClassName("activatedCard")[0].id;
        let msg = Messages.O_ROUTE_CLAIM;
        msg.data = {pid: playerID, color: color, route: routeID, continent: "eu"};
        socket.send(JSON.stringify(msg));
    } else {
        alert("Select cards from your collection first!");
    }
}
