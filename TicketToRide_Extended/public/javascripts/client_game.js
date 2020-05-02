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

    playerID = getCookie("playerID");
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


    socket.emit('player-ingame-join', {playerID: playerID, gameID: gameID});

    socket.on('open-cards', (cardData) => {
        if (!cardData.shuffle) {
            setOpenTickets(cardData.cards);
        } else {
            shuffle(cardData.cards);
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

    // socket.onmessage = function (event) {
    //     let incomingMsg = JSON.parse(event.data);
    //     console.log("incomingMsg: " + JSON.stringify(incomingMsg));

    //     if (incomingMsg.type === Messages.T_PLAYER_NAME) {
    //         playerID = parseInt(getCookie("playerID"));

    //         let conid = incomingMsg.data.pid;

    //         let msg = Messages.O_PLAYER_EXISTING_ID;
    //         msg.data = {pid: playerID, conId: conid, gid: getCookie("gameID")};
    //         socket.send(JSON.stringify(msg));
    //     }

    //     if (incomingMsg.type === Messages.T_PLAYER_WELCOME) {
    //         let msg1 = Messages.O_PLAYER_JOIN;
    //         msg1.data = {pid: playerID, conId: playerID};
    //         socket.send(JSON.stringify(msg1));
    //     }

    //     if (incomingMsg.type === Messages.T_OPEN_CARDS) {
    //         if (!incomingMsg.data.shuffle) {
    //             setOpenTickets(incomingMsg.data.cards);
    //         } else {
    //             shuffle(incomingMsg.data.cards);
    //         }
    //     }

    //     if (incomingMsg.type === Messages.T_NEW_OPEN_CARD) {
    //         replaceCard(incomingMsg.data.repCard, incomingMsg.data.newColor);
    //         if (!document.getElementById(incomingMsg.data.repCard).classList.contains("loco")) {
    //             disableLocomotive();
    //         }
    //     }

    //     if (incomingMsg.type === Messages.T_REQUEST_TRAIN) {
    //         cardDeal.play();
    //         document.getElementById("closedCard").classList.add("cardTakenSelf", "disabled");
    //         setTimeout(function () {
    //             document.getElementById("closedCard").classList.remove("cardTakenSelf", "disabled")
    //         }, 1000);
    //     }

    //     if (incomingMsg.type === Messages.T_ROUTE_CLAIM) {
    //         if (incomingMsg.data.status === true) {
    //             let imageLocation = document.getElementById(incomingMsg.data.continent);
    //             let linkToTrainsToAdd = "images/trainsOnMap/" + incomingMsg.data.continent + "/" + incomingMsg.data.route + ".png";

    //             let carts = document.createElement('img');
    //             carts.src = linkToTrainsToAdd;
    //             carts.classList.add("carts");
    //             carts.classList.add(incomingMsg.data.pcol + "Wagons");
    //             carts.classList.add("cartsBlinking");
    //             setTimeout(function() {
    //                 carts.classList.remove("cartsBlinking");
    //             }, 4000);
    //             imageLocation.append(carts);

    //             if (document.getElementById(incomingMsg.data.continent).style.display === "block") {
    //                 cashRegister.play();
    //             } else {
    //                 differentContinent.play();
    //                 let tab = document.getElementById(incomingMsg.data.continent + "tab");
    //                 tab.classList.add("flashingFlag");
    //                 setTimeout(function () {
    //                     tab.classList.remove("flashingFlag");
    //                 }, 1600)
    //             }

    //             if (incomingMsg.data.pid === playerID) {
    //                 document.getElementById(incomingMsg.data.continent).classList.add("disabled");
    //                 document.getElementById("endTurn").style.display = "block";
    //             }
    //         } else {
    //             if (incomingMsg.data.pid === playerID) {
    //                 buzz.play();

    //                 let card = document.getElementsByClassName("activatedCard")[0];
    //                 card.classList.add("cantCard");
    //                 setTimeout(function () {
    //                     card.classList.remove("cantCard");
    //                 }, 400);
    //             }
    //         }
    //     }

    //     if (incomingMsg.type === Messages.T_PLAYER_ROUND) {
    //         if (!lastRoundShown && incomingMsg.data.lastRound) {
    //             lastRoundShown = true;
    //             alert("A player has less than 3 wagons. This is the last round!");
    //         }

    //         currentMove = incomingMsg.data.thing;
    //         markCurrentPlayer(incomingMsg.data.pid);


    //         if (currentMove === 0) {
    //             enableLocomotive();
    //             document.getElementById("endTurn").style.display = "none";
    //         }

    //         if (incomingMsg.data.pid !== playerID) {
    //             document.getElementById("ownCardContainer").classList.add("disabled");
    //             document.getElementById("generalCards").classList.add("disabled");
    //             document.getElementsByClassName("tabcontent")[0].classList.add("disabled");
    //             document.getElementsByClassName("tabcontent")[1].classList.add("disabled");
    //         }
    //         if (incomingMsg.data.pid === playerID && currentMove === 0) {
    //             trainHorn.play();
    //             document.getElementById("ownCardContainer").classList.remove("disabled");
    //             document.getElementById("generalCards").classList.remove("disabled");
    //             document.getElementsByClassName("tabcontent")[0].classList.remove("disabled");
    //             document.getElementsByClassName("tabcontent")[1].classList.remove("disabled");
    //             document.getElementById("routeCard").classList.remove("disabled");
    //         }
    //     }

    //     if (incomingMsg.type === Messages.T_PLAYER_TOOK_DESTINATION) {
    //         cardDeal.play();
    //         receivedDestinations(incomingMsg.data, 3, false);
    //     }

    //     if (incomingMsg.type === Messages.T_PLAYER_CLOSED_MOVE) {
    //         if (incomingMsg.data.pid !== playerID) {
    //             console.log("Someone did something and I am not allowed to know what :(");
    //             if (incomingMsg.data.move === "TRAIN-CARD") {
    //                 cardDeal.play();
    //                 document.getElementById("closedCard").classList.add("cardTaken", "disabled");
    //                 setTimeout(function () {
    //                     document.getElementById("closedCard").classList.remove("cardTaken", "disabled")
    //                 }, 1000);
    //             }
    //             if (incomingMsg.data.move === "ROUTE-CARD") {
    //                 cardDeal.play();
    //                 document.getElementById("routeCard").classList.add("cardTaken", "disabled");
    //                 setTimeout(function () {
    //                     document.getElementById("routeCard").classList.remove("cardTaken", "disabled")
    //                 }, 1000);
    //             }
    //         }
    //     }

    //     if (incomingMsg.type === Messages.T_PLAYER_COMPLETED_ROUTE) {
    //         ticketCompleted.play();
    //         completedRoute(incomingMsg.data);
    //     }

    //     if (incomingMsg.type === Messages.T_GAME_END) {
    //         window.location.pathname = '/score';
    //     }

    //     if (incomingMsg.type === Messages.T_LOBBY) {
    //         window.location.pathname = '/';
    //     }
    // };
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
        let msg = Messages.O_ROUTE_CLAIM;
        msg.data = {pid: playerID, color: color, route: routeID, continent: "eu"};
        socket.send(JSON.stringify(msg));
    } else {
        alert("Select cards from your collection first!");
    }
}

function claimUsRoute(routeID) {
    if (document.getElementsByClassName("activatedCard")[0] !== undefined) {
        let color = document.getElementsByClassName("activatedCard")[0].id;
        let msg = Messages.O_ROUTE_CLAIM;
        msg.data = {pid: playerID, color: color, route: routeID, continent: "us"};
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
        let msg = Messages.O_PLAYER_FINISHED;
        socket.send(JSON.stringify(msg));
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
