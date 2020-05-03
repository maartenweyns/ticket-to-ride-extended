var socket;
var playerID;
var gameID;
var currentMove;

var music = new Audio("../sounds/america.mp3");
var startsound = new Audio("../sounds/startGame.mp3");
var buzz = new Audio("../sounds/IG_F_Cant.mp3");
var cardDeal = new Audio("../sounds/card_dealt3.mp3");
var cardShuffle = new Audio("../sounds/card_shuffling3.mp3");
var cashRegister = new Audio("../sounds/cash_register3.mp3");
var ticketCompleted = new Audio("../sounds/ticketCompletedVictory.mp3");
var trainHorn = new Audio("../sounds/train_horn2.mp3");
var differentContinent = new Audio("../sounds/differentContinent.mp3")
var allAudio = [music, startsound, buzz, cardDeal, cardShuffle, cashRegister, ticketCompleted, trainHorn, differentContinent];

var audioUnlocked = false;
var lastRoundShown = false;

socket = io(location.host);

(function setup() {

    playerID = parseInt(getCookie("playerID"));
    gameID = getCookie("gameID");

    // Disable game elements from users
    document.getElementById("eutab").click();
    document.getElementById("endTurn").style.display = "none";
    document.getElementById("ownCardContainer").classList.add("disabled");
    document.getElementById("generalCards").classList.add("disabled");
    document.getElementsByClassName("tabcontent")[0].classList.add("disabled");
    document.getElementsByClassName("tabcontent")[1].classList.add("disabled");

    music.loop = true;
    startsound.play().then(function () {
        music.play();
        audioUnlocked = true;
    }).catch(function (){
        alert("To unlock your audio, please press your own player on the left side of the screen!");
    });

    socket.on('connect', () => {
        console.log("Connceted to server");
        socket.emit('player-ingame-join', {playerID: playerID, gameID: gameID});
    });

    socket.on('open-cards', (cardData) => {
        let shuffle = JSON.parse(cardData.shuffle)
        if (!shuffle) {
            setOpenTickets(cardData.cards);
        } else {
            shufflecards(cardData.cards);
        }
    });

    socket.on('own-cards', (cards) => {
        let ownCardContainer = document.getElementById("ownCardContainer");
        ownCardContainer.innerHTML = "";
        addCardToCollection("black", cards.black);
        addCardToCollection("blue", cards.blue);
        addCardToCollection("brown", cards.brown);
        addCardToCollection("green", cards.green);
        addCardToCollection("purple", cards.purple);
        addCardToCollection("red", cards.red);
        addCardToCollection("white", cards.white);
        addCardToCollection("yellow", cards.yellow);
        addCardToCollection("loco", cards.loco);
    });

    socket.on('initial-routes', (routes) => {
        receivedDestinations(routes, 4, true);
    });

    socket.on('player-overview', (players) => {
        addUsers(players);
    });

    socket.on('player-round', (round) => {
        player = parseInt(round.pid);

        if (!lastRoundShown && round.lastRound) {
            lastRoundShown = true;
            alert("A player has less than 3 wagons. This is the last round!");
        }

        currentMove = parseInt(round.thing);
        markCurrentPlayer(player);

        if (currentMove === 0) {
            enableLocomotive();
            document.getElementById("endTurn").style.display = "none";
        }

        if (player !== playerID) {
            document.getElementById("ownCardContainer").classList.add("disabled");
            document.getElementById("generalCards").classList.add("disabled");
            document.getElementsByClassName("tabcontent")[0].classList.add("disabled");
            document.getElementsByClassName("tabcontent")[1].classList.add("disabled");
        }

        if (player === playerID && currentMove === 0) {
            trainHorn.play();
            document.getElementById("ownCardContainer").classList.remove("disabled");
            document.getElementById("generalCards").classList.remove("disabled");
            document.getElementsByClassName("tabcontent")[0].classList.remove("disabled");
            document.getElementsByClassName("tabcontent")[1].classList.remove("disabled");
            document.getElementById("routeCard").classList.remove("disabled");
        }
    });

    socket.on('new-open-card', (data) => {
        replaceCard(data.repCard, data.newColor);
        if (!document.getElementById(data.repCard).classList.contains("loco")) {
            disableLocomotive();
        }
    });

    socket.on('closed-train', (color) => {
        cardDeal.play();
        document.getElementById("closedCard").classList.add("cardTakenSelf", "disabled");
        setTimeout(function () {
            document.getElementById("closedCard").classList.remove("cardTakenSelf", "disabled")
        }, 1000);
    });

    socket.on('closed-move', (data) => {
        if (data.move === "TRAIN-CARD") {
            cardDeal.play();
            document.getElementById("closedCard").classList.add("cardTaken", "disabled");
            setTimeout(function () {
                document.getElementById("closedCard").classList.remove("cardTaken", "disabled")
            }, 1000);
        }
        if (data.move === "ROUTE-CARD") {
            cardDeal.play();
            document.getElementById("routeCard").classList.add("cardTaken", "disabled");
            setTimeout(function () {
                document.getElementById("routeCard").classList.remove("cardTaken", "disabled")
            }, 1000);
        }
    });

    socket.on('route-claim', (data) => {
        if (JSON.parse(data.status)) {
            let imageLocation = document.getElementById(data.continent);
            let linkToTrainsToAdd = "images/trainsOnMap/" + data.continent + "/" + data.route + ".png";

            let carts = document.createElement('img');
            carts.src = linkToTrainsToAdd;
            carts.classList.add("carts");
            carts.classList.add(data.pcol + "Wagons");
            carts.classList.add("cartsBlinking");
            setTimeout(function() {
                carts.classList.remove("cartsBlinking");
            }, 4000);
            imageLocation.append(carts);

            if (document.getElementById(data.continent).style.display === "block") {
                cashRegister.play();
            } else {
                differentContinent.play();
                let tab = document.getElementById(data.continent + "tab");
                tab.classList.add("flashingFlag");
                setTimeout(function () {
                    tab.classList.remove("flashingFlag");
                }, 1600)
            }

            if (data.pid === playerID) {
                document.getElementById(data.continent).classList.add("disabled");
                document.getElementById("endTurn").style.display = "block";
            }
        } else {
            buzz.play();

            let card = document.getElementsByClassName("activatedCard")[0];
            card.classList.add("cantCard");
            setTimeout(function () {
                card.classList.remove("cantCard");
            }, 400);
        }
    });

    socket.on('player-destination', (data) => {
        cardDeal.play();
        receivedDestinations(data, 3, false);
    });

    socket.on('player-completed-route', (data) => {
        ticketCompleted.play();
        completedRoute(data);
    });

    socket.on('game-end', () => {
        window.location.pathname = '/score';
    });

    socket.on('lobby', () => {
        window.location.pathname = '/';
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        alert('You are disconnected. The app will try to reconnect automatically');
    });
})();

function addUsers(users) {
    let userBox = document.getElementById("userBox");
    userBox.innerHTML = '';
    while (users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('div');
        userEntry.classList.add("playerBackdrop");

        let userBackdrop = document.createElement('img');
        userBackdrop.src = 'images/playerInformation/playerBackdrop/support-opponent-' + user.color + '.png';
        userBackdrop.classList.add("playerBackdropImage");
        userBackdrop.id = "p" + user.id;

        let playerName = document.createElement('p');
        playerName.innerText = user.name + "(" + user.score + ")";
        playerName.classList.add("playerName");

        let numberOfCartsText = document.createElement('p');
        numberOfCartsText.classList.add("numberOfCartsText");
        numberOfCartsText.innerText = user.numberOfTrains;

        let numberOfTrainCardsText = document.createElement('p');
        numberOfTrainCardsText.classList.add("numberOfTrainCardsText");
        numberOfTrainCardsText.innerText = user.numberOfTrainCards;

        let numberOfRoutesText = document.createElement('p');
        numberOfRoutesText.classList.add("numberOfRouteCardsText");
        numberOfRoutesText.innerText = user.numberOfRoutes;

        userEntry.append(userBackdrop);
        userEntry.append(playerName);
        userEntry.append(numberOfCartsText);
        userEntry.append(numberOfTrainCardsText);
        userEntry.append(numberOfRoutesText);
        if (user.id === playerID && !audioUnlocked) {
            userEntry.onclick = function () {
                unlockaudio();
            };
        }
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
    imageMapResize();
}

function claimEuRoute(routeID) {
    if (document.getElementsByClassName("activatedCard")[0] !== undefined) {
        let color = document.getElementsByClassName("activatedCard")[0].id;
        socket.emit('route-claim', {pid: playerID, color: color, route: routeID, continent: "eu"});
        document.getElementById("generalCards").classList.add("disabled");
    } else {
        alert("Select cards from your collection first!");
    }
}

function claimUsRoute(routeID) {
    if (document.getElementsByClassName("activatedCard")[0] !== undefined) {
        let color = document.getElementsByClassName("activatedCard")[0].id; 
        socket.emit('route-claim', {pid: playerID, color: color, route: routeID, continent: "us"});
        document.getElementById("generalCards").classList.add("disabled");
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

function unlockaudio() {
    for(let audio of allAudio) {
        audio.play();
        audio.pause();
        audio.currentTime = 0;
    }

    music.loop = true;
    music.play().then(function() {
        alert("Audio unlocked!");
        audioUnlocked = true;
    }).catch(function(){
        alert("Audio could not be unlocked. Maybe try again? :)");
    })
}

function endTurn() {
    if (confirm("Do you want to end your turn?")) {
        socket.emit('player-finished');
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
