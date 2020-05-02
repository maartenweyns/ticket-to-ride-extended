function requestDestination() {
    let confirmed;
    confirmed = confirm("Do you really want to pick new destinations?");
    if (confirmed) {
        socket.emit('player-destination', playerID);
    }
}

function receivedDestinations(data, amountOfCards, initialRound) {
    let cardsContainer = document.getElementById("ownCardContainer");
    let deckContainer = document.getElementById("destiCardsChoosingPanel");
    cardsContainer.style.display = "none";
    deckContainer.style.display = "flex";

    for (let i = 0; i < amountOfCards; i++) {
        let card = document.createElement('img');
        card.src = "images/routeCards/" + data[i][1].continent + "-" + data[i][0] + ".png";
        card.classList.add("destiDeckCard");
        card.id = data[i][1].continent + "-" + data[i][0];
        card.onclick = function() {
            toggleActivationDestiCard(card.id);
        }
        deckContainer.append(card);
    }
    let confirmButton = document.createElement('button');
    confirmButton.innerHTML = "CHOOSE";
    confirmButton.onclick = function () {
        confirmDestis(initialRound);
    }
    deckContainer.append(confirmButton);
}

function toggleActivationDestiCard(cardID) {
    let cardInfo = cardID.split("-");
    let imageLocation = document.getElementById(cardInfo[0]);
    let card = document.getElementById(cardID);
    if (card.classList.contains("activatedDestiCard")) {
        card.classList.remove("activatedDestiCard");
        let city1 = document.getElementById(cardInfo[1] + "Highlight");
        let city2 = document.getElementById(cardInfo[2] + "Highlight");
        city1.parentNode.removeChild(city1);
        city2.parentNode.removeChild(city2);
    } else {
        card.classList.add("activatedDestiCard");
        let city1 = document.createElement('img');
        let city2 = document.createElement('img');
        city1.src = "images/cityHighlights/" + cardInfo[0] + "/" + cardInfo[1] + ".png";
        city2.src = "images/cityHighlights/" + cardInfo[0] + "/" + cardInfo[2] + ".png";
        city1.id = cardInfo[1] + "Highlight";
        city2.id = cardInfo[2] + "Highlight";
        city1.classList.add("dots");
        city2.classList.add("dots");
        imageLocation.append(city1, city2);
    }
}

function confirmDestis(initialRound) {
    let minimalAmount = 1;

    let destinations = document.getElementById("destiCardsChoosingPanel").children;
    let container = document.getElementsByClassName("destiCards")[0];

    let chosenDestinaions = document.getElementsByClassName("activatedDestiCard");

    if (initialRound) {
        let us = false;
        let eu = false;

        minimalAmount = 2;

        for (let i = 0; i < chosenDestinaions.length; i++) {
            if (chosenDestinaions[i].id.includes("us")) {
                us = true;
            }
            if (chosenDestinaions[i].id.includes("eu")) {
                eu = true;
            }
        }
    
        if (! (eu && us)) {
            alert("You must choose two routes, at least one from Europe and one from America!");
            return;
        }
    }

    if (!(chosenDestinaions.length >= minimalAmount)) {
        alert("You should pick at least " + minimalAmount + " destination(s)!");
        return;
    }

    for (let i = 0; i < destinations.length - 1; i++) {
        if (destinations[i].classList.contains("activatedDestiCard")) {
            let routeCardContainer = document.createElement('div');
            routeCardContainer.id = destinations[i].id;

            let routeCard = document.createElement('img');
            routeCard.src = "images/routeCards/" + destinations[i].id + ".png";
            routeCard.onclick = function () {
                cycleBetweenRouteCards();
            }
            routeCard.classList.add("destiCard");

            routeCardContainer.append(routeCard);

            hideExistingRouteCards();

            container.append(routeCardContainer);

            socket.emit('accepted-destination', {pid: playerID, rid: destinations[i].id});
        } else {
            socket.emit('rejected-destination', destinations[i].id);
        }
    }

    socket.emit('player-finished');

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
            // document.getElementById(cards[i].id.split("-")[1] + "Highlight").classList.remove("pulsatingDots");
            // document.getElementById(cards[i].id.split("-")[2] + "Highlight").classList.remove("pulsatingDots");
            if (i < cards.length - 1) {
                cards[i + 1].style.display = "block";
                cardDeal.play();
                // document.getElementById(cards[i + 1].id.split("-")[1] + "Highlight").classList.add("pulsatingDots");
                // document.getElementById(cards[i + 1].id.split("-")[2] + "Highlight").classList.add("pulsatingDots");
            } else {
                cards[0].style.display = "block";
                cardDeal.play();
                // document.getElementById(cards[0].id.split("-")[1] + "Highlight").classList.add("pulsatingDots");
                // document.getElementById(cards[0].id.split("-")[2] + "Highlight").classList.add("pulsatingDots");
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
