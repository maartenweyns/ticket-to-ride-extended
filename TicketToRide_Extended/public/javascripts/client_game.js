var socket;
var playerID;

if (document.location.protocol === "https:" || document.location.protocol === "https:") {
    socket = new WebSocket("wss://" + location.host);
} else {
    socket = new WebSocket("ws://" + location.host);
}

(function setup() {
    document.getElementById("defaultOpen").click();

    let startGameSound = new Audio("sounds/startGame.ogg");
    let music = new Audio("sounds/america.ogg");
    music.loop = true;
    startGameSound.play().then(function() {music.play()});

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("incomingMsg: " + JSON.stringify(incomingMsg));

        if (incomingMsg.type === Messages.T_PLAYER_NAME) {
            let cookie =  document.cookie.split("=");
            playerID = parseInt(cookie[1]);

            let conid = incomingMsg.data;

            let msg = Messages.O_PLAYER_EXISTING_ID;
            msg.data = {pid: playerID, conId: conid};
            socket.send(JSON.stringify(msg));
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
            new Audio("sounds/card_dealt3.ogg").play();
            document.getElementById("closedCard").classList.add("cardTakenSelf", "disabled");
            setTimeout(function() {document.getElementById("closedCard").classList.remove("cardTakenSelf", "disabled")}, 1000);
            addCardToCollection(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_PLAYER_OVERVIEW) {
            addUsers(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_ROUTE_CLAIM) {
            if (incomingMsg.data.status === true) {
                let imageLocation = document.getElementById("Europe");
                let linkToTrainsToAdd = "images/trainsOnMap/eu/" + incomingMsg.data.pcol + "/" + incomingMsg.data.route + ".png";

                let carts = document.createElement('img');
                carts.src = linkToTrainsToAdd;
                carts.classList.add("carts");
                imageLocation.append(carts);

                new Audio("sounds/cash_register3.ogg").play();

                if (incomingMsg.data.pid === playerID) {
                    removeCardFromCollection(incomingMsg.data.color, incomingMsg.data.amount);
                    removeCardFromCollection("loco", incomingMsg.data.locos);
                }
            } else {
                if (incomingMsg.data.pid === playerID) {
                    let audio = new Audio("sounds/buzz4.ogg");
                    audio.play();
                }
            }
        }

        if (incomingMsg.type === Messages.T_PLAYER_ROUND) {
            markCurrentPlayer(incomingMsg.data.pid);

            if (incomingMsg.data.pid === playerID && incomingMsg.data.thing === 0) {
                let audio = new Audio("sounds/train_horn2.ogg");
                audio.play();
            }
            if (incomingMsg.data.pid !== playerID) {
                document.getElementById("ownCardContainer").classList.add("disabled");
                document.getElementById("cardContainer").classList.add("disabled");
                document.getElementsByClassName("tabcontent")[0].classList.add("disabled");
                document.getElementsByClassName("tabcontent")[1].classList.add("disabled");
            }
            if (incomingMsg.data.pid === playerID) {
                document.getElementById("ownCardContainer").classList.remove("disabled");
                document.getElementById("cardContainer").classList.remove("disabled");
                document.getElementsByClassName("tabcontent")[0].classList.remove("disabled");
                document.getElementsByClassName("tabcontent")[1].classList.remove("disabled");
            }
        }

        if (incomingMsg.type === Messages.T_PLAYER_TOOK_DESTINATION) {
            new Audio("sounds/card_dealt3.ogg").play();
            receivedDestinations(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_PLAYER_CLOSED_MOVE) {
            if (incomingMsg.data.pid !== playerID) {
                console.log("Someone did something and I am not allowed to know what :(");
                if (incomingMsg.data.move === "TRAIN-CARD") {
                    new Audio("sounds/card_dealt3.ogg").play();
                    document.getElementById("closedCard").classList.add("cardTaken", "disabled");
                    setTimeout(function() {document.getElementById("closedCard").classList.remove("cardTaken", "disabled")}, 1000);
                }
                if (incomingMsg.data.move === "ROUTE-CARD") {
                    new Audio("sounds/card_dealt3.ogg").play();
                    document.getElementById("routeCard").classList.add("cardTaken", "disabled");
                    setTimeout(function() {document.getElementById("closedCard").classList.remove("cardTaken", "disabled")}, 1000);
                }
            }
        }

        if (incomingMsg.type === Messages.T_PLAYER_COMPLETED_ROUTE) {
            new Audio("sounds/ticketCompletedVictory.ogg").play();
            completedRoute(incomingMsg.data);
        }
    };
})();

function addUsers(users) {
    let userBox = document.getElementById("userBox");
    userBox.innerHTML = '';
    while (users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('div');
        userEntry.classList.add("playerBackdrop");

        let userBackdrop = document.createElement('img');
        userBackdrop.src = 'images/playerInformation/playerBackdrop/support-opponent-Human-Horizontal-' + user.color + '.png';
        userBackdrop.classList.add("playerBackdropImage");
        userBackdrop.id = "p" + user.id;

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

function activateTrainCards(color) {
    let cardItem = document.getElementById(color);
    if (cardItem.classList.contains("activatedCard")) {
        cardItem.classList.remove("activatedCard");
    } else {
        let cardPile = document.getElementById("ownCardContainer");
        for (let i = 0; i < cardPile.children.length; i++) {
            cardPile.children[i].classList.remove("activatedCard");
        }
        cardItem.classList.add("activatedCard");
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

function markCurrentPlayer(pid) {
    for (let i = 0; i < 8; i++) {
        if (document.getElementById("p" + pid) !== null) {
            document.getElementById("p" + pid).classList.remove("currentPlayer");
        }
    }
    document.getElementById("p" + pid).classList.add("currentPlayer");
}
