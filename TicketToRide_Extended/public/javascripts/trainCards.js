function setOpenTickets(openTickets) {
    let openCardsBox = document.getElementById("openCardsBox");
    for(let i = 0; i < 5; i++){
        let card = document.createElement('img');
        let color = openTickets["Card" + i];
        card.src = "images/trainCards/us_WagonCard_" + color + ".png";
        card.classList.add("card");
        card.classList.add(color);
        card.id = "Card" + i;
        card.onclick = function() {
            takeCard("Card" + i);
        };
        openCardsBox.appendChild(card);
    }
}

function replaceCard(cardId, newColor) {
    let audio = new Audio("sounds/card_dealt3.ogg");
    let oldcard = document.getElementById(cardId);
    let card = document.createElement('img');
    card.src = "images/trainCards/us_WagonCard_" + newColor + ".png";
    card.classList.add("card");
    card.classList.add(newColor);
    card.id = cardId;
    card.onclick = function() {
        takeCard(cardId);
    };
    audio.play();
    oldcard.parentNode.replaceChild(card, oldcard);
}

function shuffle(openTickets) {
    let openCardsBox = document.getElementById("openCardsBox");
    for (let i = 0; i < 5; i++){
        let card = document.getElementById("Card" + i);
        if (card.classList.contains("loco")) {
            card.classList.add("alertShadow");
        }
    }
    setTimeout(function() {
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
    addCardToCollection(color);
}

function addCardToCollection(color) {
    let ownCardContainer = document.getElementById("ownCardContainer");

    let cardsAlreadyOwned = ownCardContainer.children;
    for (let i = 0; i < cardsAlreadyOwned.length; i++) {
        console.log(cardsAlreadyOwned[i].id);
        if (cardsAlreadyOwned[i].id === color) {
            let number = parseInt(cardsAlreadyOwned[i].children[1].innerHTML) + 1;
            cardsAlreadyOwned[i].children[1].innerHTML = number + "";
            cardsAlreadyOwned[i].children[1].style.visibility = "visible";
            return;
        }
    }

    let cardContainer = document.createElement('div');
    cardContainer.id = color;
    cardContainer.classList.add("cardContainer");
    cardContainer.onclick = function() {activateTrainCards(color)};

    let card = document.createElement('img');
    card.src = "images/trainCards/us_WagonCard_" + color + ".png";
    card.id = color;
    card.classList.add("ownCard");
    card.classList.add(color);

    let amountOf = document.createElement('p');
    amountOf.classList.add("cardCounter");
    amountOf.id = "counter";
    amountOf.innerHTML = "1";
    amountOf.style.visibility = "hidden";


    cardContainer.append(card, amountOf);
    ownCardContainer.appendChild(cardContainer);
}

function requestClosedCard() {
    let msg = Messages.O_REQUEST_TRAIN;
    msg.data = playerID;
    socket.send(JSON.stringify(msg));
}
