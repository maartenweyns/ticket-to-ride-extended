function setOpenTickets(openTickets) {
    let openCardsBox = document.getElementById("openCardsBox");
    for (let i = 0; i < 5; i++) {
        let card = document.createElement('img');
        let color = openTickets["Card" + i];
        card.src = "images/trainCards/us_WagonCard_" + color + ".png";
        card.classList.add("card");
        card.classList.add(color);
        card.id = "Card" + i;
        card.onclick = function () {
            takeCard("Card" + i);
        };
        openCardsBox.appendChild(card);
    }
}

function replaceCard(cardId, newColor) {
    let oldcard = document.getElementById(cardId);
    if (!oldcard.classList.contains("cardTakenSelf")) {
        oldcard.classList.add("cardTaken", "disabled");
    }
    new Audio("sounds/card_dealt3.ogg").play();
    setTimeout(function () {
        let card = document.createElement('img');
        card.src = "images/trainCards/us_WagonCard_" + newColor + ".png";
        card.classList.add("card");
        card.classList.add(newColor);
        card.id = cardId;
        card.onclick = function () {
            takeCard(cardId);
        };
        oldcard.parentNode.replaceChild(card, oldcard);
        if (newColor === "loco" && currentMove !== 0) {
            card.classList.add("disabledLoco");
        }
    }, 1000)
}

function shuffle(openTickets) {
    let openCardsBox = document.getElementById("openCardsBox");
    for (let i = 0; i < 5; i++) {
        let card = document.getElementById("Card" + i);
        if (card.classList.contains("loco")) {
            card.classList.add("alertShadow");
        }
    }
    setTimeout(function () {
        openCardsBox.innerHTML = '';
        setOpenTickets(openTickets);
        let audio = new Audio("sounds/card_shuffling3.ogg");
        audio.play();
    }, 1000);
}

function takeCard(cardID) {
    let msg = Messages.O_PLAYER_TOOK_OPEN_TRAIN;
    msg.data = {card: cardID, pid: playerID, color: document.getElementById(cardID).classList[1]};
    socket.send(JSON.stringify(msg));
    let color = document.getElementById(cardID).classList[1];
    // addCardToCollection(color);

    if (msg.data.color !== "loco") {
        disableOtherPlayerActions();
    }

    document.getElementById(cardID).classList.add("cardTakenSelf", "disabled");
    setTimeout(function () {
        document.getElementById("closedCard").classList.remove("cardTaken", "disabled")
    }, 1000);
}

function addCardToCollection(color, amount) {
    if (amount === 0) {
        return;
    }

    let ownCardContainer = document.getElementById("ownCardContainer");

    let cardsAlreadyOwned = ownCardContainer.children;
    for (let i = 0; i < cardsAlreadyOwned.length; i++) {
        console.log(cardsAlreadyOwned[i].id);
        if (cardsAlreadyOwned[i].id === color) {
            let number = parseInt(cardsAlreadyOwned[i].children[1].innerHTML) + amount;
            cardsAlreadyOwned[i].children[1].innerHTML = number + "";
            cardsAlreadyOwned[i].children[1].style.visibility = "visible";
        }
    }

    let cardContainer = document.createElement('div');
    cardContainer.id = color;
    cardContainer.classList.add("cardContainer");
    cardContainer.onclick = function () {
        activateTrainCards(color)
    };

    let card = document.createElement('img');
    card.src = "images/trainCards/rotated/us_WagonCard_" + color + ".png";
    card.id = color;
    card.classList.add("ownCard");
    card.classList.add(color);

    let amountOf = document.createElement('p');
    amountOf.classList.add("cardCounter");
    amountOf.id = "counter";
    amountOf.innerHTML = amount + "";
    if (amount === 1) {
        amountOf.style.visibility = "hidden";
    }

    cardContainer.append(card, amountOf);
    ownCardContainer.appendChild(cardContainer);
}

function requestClosedCard() {
    disableOtherPlayerActions();
    let msg1 = Messages.O_REQUEST_TRAIN;
    msg1.data = playerID;
    socket.send(JSON.stringify(msg1));
}

function disableOtherPlayerActions() {
    let openCards = document.getElementById("openCardsBox").children;
    document.getElementById("routeCard").classList.add("disabled");
    document.getElementsByClassName("tabcontent")[0].classList.add("disabled");
    document.getElementsByClassName("tabcontent")[1].classList.add("disabled");

    for (let i = 0; i < openCards.length; i++) {
        if (openCards[i].classList.contains("loco")) {
            openCards[i].classList.add("disabledLoco");
        }
    }
}

function enableLocomotive() {
    let openCards = document.getElementById("openCardsBox").children;

    for (let i = 0; i < openCards.length; i++) {
        if (openCards[i].classList.contains("loco")) {
            openCards[i].classList.remove("disabledLoco");
        }
    }
}