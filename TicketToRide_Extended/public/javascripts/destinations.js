function requestDestination() {
    let confirmed;
    confirmed = confirm("Do you really want to pick new destinations?");
    if (confirmed) {
        let msg1 = Messages.O_PLAYER_TOOK_DESTINATION;
        msg1.data = playerID;
        socket.send(JSON.stringify(msg1));
    }
}

function receivedDestinations(data, minimalAmount) {
    let cardsContainer = document.getElementById("ownCardContainer");
    let deckContainer = document.getElementById("destiCardsChoosingPanel");
    cardsContainer.style.display = "none";
    deckContainer.style.display = "flex";

    for (let i = 0; i < 3; i++) {
        let card = document.createElement('img');
        card.src = "images/routeCards/euRoutes/eu-" + data[i][0] + ".png";
        card.classList.add("destiDeckCard");
        card.id = data[i][0];
        card.onclick = function() {
            toggleActivationDestiCard(card.id);
        }
        deckContainer.append(card);
    }
    let confirmButton = document.createElement('button');
    confirmButton.innerHTML = "CHOOSE";
    confirmButton.onclick = function () {
        confirmDestis(minimalAmount);
    }
    deckContainer.append(confirmButton);
}

function toggleActivationDestiCard(cardID) {
    let card = document.getElementById(cardID);
    if (card.classList.contains("activatedDestiCard")) {
        card.classList.remove("activatedDestiCard");
    } else {
        card.classList.add("activatedDestiCard");
    }
}

function confirmDestis(minimalAmount) {
    let destinations = document.getElementById("destiCardsChoosingPanel").children;
    let container = document.getElementsByClassName("destiCards")[0];

    let chosenDestinaions = document.getElementsByClassName("activatedDestiCard");
    if (!(chosenDestinaions.length >= minimalAmount)) {
        alert("You should pick at least " + minimalAmount + " destination(s)!");
        return;
    }

    for (let i = 0; i < destinations.length - 1; i++) {
        if (destinations[i].classList.contains("activatedDestiCard")) {
            let routeCardContainer = document.createElement('div');
            routeCardContainer.id = destinations[i].id;

            let routeCard = document.createElement('img');
            routeCard.src = "images/routeCards/euRoutes/eu-" + destinations[i].id + ".png";
            routeCard.onclick = function () {
                cycleBetweenRouteCards();
            }
            routeCard.classList.add("destiCard");

            routeCardContainer.append(routeCard);

            hideExistingRouteCards();

            container.append(routeCardContainer);

            let msg = Messages.O_ACCEPTED_DESTI;
            msg.data = {pid: playerID, rid: destinations[i].id}
            socket.send(JSON.stringify(msg));
        } else {
            let msg = Messages.O_REJECTED_DESTI;
            msg.data = destinations[i].id;
            socket.send(JSON.stringify(msg));
        }
    }

    let msg = Messages.O_PLAYER_FINISHED;
    socket.send(JSON.stringify(msg));

    document.getElementById("destiCardsChoosingPanel").innerHTML = '';
    document.getElementById("destiCardsChoosingPanel").style.display = "none";
    document.getElementById("ownCardContainer").style.display = "flex";
}

function hideExistingRouteCards() {
    let cards = document.getElementsByClassName("destiCards")[0].children;

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.display = "none";
    }
}

function cycleBetweenRouteCards() {
    let cards = document.getElementsByClassName("destiCards")[0].children;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].style.display === "block" || cards[i].style.display === "") {
            cards[i].style.display = "none";
            if (i < cards.length - 1) {
                cards[i + 1].style.display = "block";
                new Audio("sounds/card_dealt3.ogg").play();
            } else {
                cards[0].style.display = "block";
                new Audio("sounds/card_dealt3.ogg").play();
            }
            break;
        }
    }
}

function completedRoute(routeID) {
    let routeDiv = document.getElementById(routeID);

    let completedOVerlay = document.createElement('img');
    completedOVerlay.src = "images/decorations/ticket-DoneFrame.png";
    completedOVerlay.classList.add("destiCard");
    completedOVerlay.style.pointerEvents = "none";

    routeDiv.append(completedOVerlay);
}