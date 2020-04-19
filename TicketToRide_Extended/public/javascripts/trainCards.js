function setOpenTickets(openTickets) {
    var openCardsBox = document.getElementById("openCardsBox");
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
    var audio = new Audio("sounds/card_dealt3.ogg");
    var oldcard = document.getElementById(cardId);
    var card = document.createElement('img');
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
    var openCardsBox = document.getElementById("openCardsBox");
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
    msg.data = {card: cardID, pid: playerID};
    socket.send(JSON.stringify(msg));
    var color = document.getElementById(cardID).classList[1];
    addCardToCollection(color);
}

function addCardToCollection(color) {
    var ownCardContainer = document.getElementById("ownCardContainer");
    var card = document.createElement('img');
    card.src = "images/trainCards/us_WagonCard_" + color + ".png";
    card.classList.add("ownCard");
    card.classList.add(color);
    card.setAttribute('style','transform:rotate(90deg)');
    ownCardContainer.appendChild(card);
}

function requestClosedCard() {
    let msg = Messages.O_REQUEST_TRAIN;
    msg.data = playerID;
    socket.send(JSON.stringify(msg));
}
