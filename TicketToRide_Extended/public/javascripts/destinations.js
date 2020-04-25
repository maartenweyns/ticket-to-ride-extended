function requestDestination() {
    let msg1 = Messages.O_PLAYER_TOOK_DESTINATION;
    msg1.data = playerID;
    socket.send(JSON.stringify(msg1));
}

function receivedDestinations(data) {
    let container = document.getElementsByClassName("destiCards")[0];

    let routeCardContainer = document.createElement('div');
    routeCardContainer.id = data[0];

    let routeCard = document.createElement('img');
    routeCard.src = "images/routeCards/euRoutes/eu-" + data[0] + ".png";
    routeCard.onclick = function () {
        cycleBetweenRouteCards();
    }
    routeCard.classList.add("destiCard");

    routeCardContainer.append(routeCard);

    hideExistingRouteCards();

    container.append(routeCardContainer);
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