function setOpenTickets(openTickets) {
    let openCardsBox = document.getElementById("openCardsBox");
    openCardsBox.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        let card = document.createElement('img');
        let color = openTickets["Card" + i];
        card.src = "images/trainCards/us_WagonCard_" + color + ".png";
        card.classList.add("trainCard");
        card.classList.add(color);
        card.id = "Card" + i;
        card.onclick = function () {
            takeCard("Card" + i);
        };
        openCardsBox.appendChild(card);
    }
}

function replaceCard(cardId, newColor, self) {
    let oldcard = document.getElementById(cardId);
    if (self) {
        oldcard.classList.add("cardTakenSelf", "disabled");
    } else {
        oldcard.classList.add("cardTaken", "disabled");
    }
    if (!sfxmuted) cardDeal.play();
    setTimeout(function () {
        let card = document.createElement('img');
        card.src = "images/trainCards/us_WagonCard_" + newColor + ".png";
        card.classList.add("trainCard");
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

function shufflecards(openTickets) {
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
        if (!sfxmuted) cardShuffle.play();
    }, 1000);
}

function takeCard(cardID) {
    socket.emit('open-train', {card: cardID, pid: playerID, color: document.getElementById(cardID).classList[1]});
}

function addCardToCollection(color, amount) {
    if (amount === 0) {
        return;
    }

    let ownCardContainer = document.getElementById("ownCardContainer");

    let cardsAlreadyOwned = ownCardContainer.children;
    for (let i = 0; i < cardsAlreadyOwned.length; i++) {
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
    disableLocomotives();
    socket.emit('closed-train', playerID);
}

function disableLocomotives() {
    let openCards = document.getElementById("openCardsBox").children;

    for (let i = 0; i < openCards.length; i++) {
        if (openCards[i].classList.contains("loco")) {
            openCards[i].classList.add("disabledLoco");
        }
    }
}

function enableLocomotives() {
    let openCards = document.getElementById("openCardsBox").children;

    for (let i = 0; i < openCards.length; i++) {
        if (openCards[i].classList.contains("loco")) {
            openCards[i].classList.remove("disabledLoco");
        }
    }
}
