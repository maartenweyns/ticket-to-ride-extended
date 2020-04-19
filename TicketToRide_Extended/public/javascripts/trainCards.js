function setOpenTickets(openTickets) {
    var openCardsBox = document.getElementById("openCardsBox");

    for(let i = 0; i < 5; i++){
        let card = document.createElement('img');
        let color = openTickets["card" + i];
        card.src = "images/trainCards/us_WagonCard_" + color + ".png";
        card.classList.add("card");
        card.classList.add(color);
        card.id = "Card" + i;
        card.onclick = function() {
            takeCard("Card" + i);
            replaceCard(i);
        };
        openCardsBox.appendChild(card);
    }
    // checkShuffleNeed();
}

// function getRandomColor() {
//     var number1 = Math.random();
//     if (number1 < 0.87) {
//         var number = Math.random();
//         if (number < 0.125) {
//             return "black";
//         } else if (number < 0.25) {
//             return "blue";
//         } else if (number < 0.375) {
//             return "brown";
//         } else if (number < 0.5) {
//             return "green";
//         } else if (number < 0.625) {
//             return "purple";
//         } else if (number < 0.75) {
//             return "red";
//         } else if (number < 0.875) {
//             return "white";
//         } else {
//             return "yellow";
//         }
//     } else {
//         return "loco";
//     }
// }

function replaceCard(cardId) {
    var audio = new Audio("sounds/card_dealt3.ogg");
    var oldcard = document.getElementById("Card"+cardId);
    var card = document.createElement('img');
    var color = getRandomColor();
    card.src = "images/trainCards/us_WagonCard_" + color + ".png";
    card.classList.add("card");
    card.classList.add(color);
    card.id = "Card" + cardId;
    card.onclick = function() {
        replaceCard(cardId);
    };
    audio.play();
    oldcard.parentNode.replaceChild(card, oldcard);
    checkShuffleNeed();
}

function shuffle() {
    var openCardsBox = document.getElementById("openCardsBox");
    openCardsBox.innerHTML = '';
    getOpenTickets();
}

function checkShuffleNeed() {
    var amountOfLocos = 0;
    var locoCards = [];
    for(let i = 0; i < 5; i++){
        var card = document.getElementById("Card" + i);
        if(card.classList.contains("loco")) {
            amountOfLocos++;
            locoCards.push(card);
        }
        if (amountOfLocos > 2) {
            break;
        }
    }
    if (amountOfLocos > 2) {
        while (locoCards.length !== 0) {
            let card = locoCards.pop();
            card.classList.add("alertShadow");
        }
        var audio = new Audio("sounds/card_shuffling3.ogg");
        setTimeout(function() {audio.play(); shuffle()}, 1000);
    }
}

function takeCard(cardID) {
    let msg = Messages.O_PLAYER_TOOK_TRAIN;
    msg.data = cardID;
    socket.send(JSON.stringify(msg));

    // var ownCardContainer = document.getElementById("ownCardContainer");
    // var card = document.createElement('img');
    // card.src = "images/trainCards/us_WagonCard_" + color + ".png";
    // card.classList.add("ownCard");
    // card.classList.add(color);
    // card.setAttribute('style','transform:rotate(90deg)');
    // ownCardContainer.appendChild(card);
}
