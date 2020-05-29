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
            showAlert("A player has less than 3 wagons! This is the last round!");
        }

        currentMove = parseInt(round.thing);
        markCurrentPlayer(player);

        if (currentMove === 0) {
            enableLocomotives();
            document.getElementById("endTurn").style.display = "none";
        }

        if (player === playerID && currentMove === 0) {
            trainHorn.play();
        }
    });

    socket.on('new-open-card', (data) => {
        if (data.pid === playerID) {
            replaceCard(data.repCard, data.newColor, true);
        } else {
            replaceCard(data.repCard, data.newColor, false);
        }
        if (!document.getElementById(data.repCard).classList.contains("loco")) {
            disableLocomotive();
        }
    });

    socket.on('closed-train', () => {
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

    socket.on('mapitem', (data) => {
        let imageLocation = document.getElementById(data.continent);

        // Construct HTML elements
        let carts = document.createElement('img');
        carts.src = `data:image/png;base64,${data.image}`;
        carts.classList.add(`${data.continent}Wagons`);
        carts.classList.add('cartsBlinking');
        setTimeout(function() {
            carts.classList.remove('cartsBlinking');
        }, 4000);
        imageLocation.append(carts);

        // Merge the image and remove it once the animation is done
        if (document.getElementsByClassName(`${data.continent}Wagons`).length > 1) {
            mergeImages([document.getElementsByClassName(`${data.continent}Wagons`)[0].src, document.getElementsByClassName(`${data.continent}Wagons`)[1].src])
                .then(b64 => document.getElementsByClassName(`${data.continent}Wagons`)[0].src = b64);
            setTimeout(function() {
                imageLocation.removeChild(carts);
            }, 4000);
        }

        // Play the cash register sound
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
    });

    socket.on('route-claim', (data) => {
        if (data.status === 'accepted') {
            document.getElementById("endTurn").style.display = 'block';
        } else if (data.status === 'alreadyClaimedThis'){
            showAlert(`You cannot do an action on ${data.continent} anymore!`);
        } else if (data.status === 'cant') {
            buzz.play();
            let card = document.getElementsByClassName("activatedCard")[0];
            card.classList.add("cantCard");
            setTimeout(function () {
                card.classList.remove("cantCard");
            }, 400);
        } else if (data.status === 'notYourTurn') {
            showAlert('It is currently not your turn!');
        }
    });

    socket.on('invalidmove', (data) => {
        showAlert(data.message);
    })

    socket.on('own-destinations', (data) => {
        drawOwnDestinations(data.uncompleted, false);
        drawOwnDestinations(data.completed, true);
    });

    socket.on('existing-trains', (data) => {
        drawExistingTrains(data.eu, 'eu');
        drawExistingTrains(data.us, 'us');
    });

    socket.on('player-destination', (data) => {
        cardDeal.play();
        receivedDestinations(data, 3, false);
    });

    socket.on('player-completed-route', (data) => {
        ticketCompleted.play();
        completedRoute(data);
    });

    socket.on('station-claim', (result) => {
        if (result) {
            document.getElementById("endTurn").style.display = 'block';
        } else {
            showAlert('You cannot place a station here!');
        }
    })

    socket.on('stations', (data) => {
        showStationMenu(data);
    });

    socket.on('game-end', () => {
        window.location.pathname = '/score';
    });

    socket.on('lobby', () => {
        window.location.pathname = '/';
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        showAlert('You are disconnected. The app will try to reconnect automatically');
    });
})();

function addUsers(users) {
    let userBox = document.getElementById("userBox");
    userBox.innerHTML = '';
    while (users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('div');
        userEntry.classList.add("playerBackdrop");
        userEntry.id = "p" + user.id;

        let userBackdrop = document.createElement('img');
        userBackdrop.src = 'images/playerInformation/' + user.color + '.png';
        userBackdrop.classList.add("playerBackdropImage");

        let playerName = document.createElement('p');
        playerName.innerText = user.name + "(" + user.score + ")";
        playerName.classList.add("playerName");

        let numberOfCartsText = document.createElement('p');
        numberOfCartsText.classList.add("numberOfCartsText");
        numberOfCartsText.innerText = user.numberOfTrains;

        let numberOfStationsText = document.createElement('p');
        numberOfStationsText.classList.add("numberOfStationsText");
        numberOfStationsText.innerText = user.numberOfStations;

        let numberOfTrainCardsText = document.createElement('p');
        numberOfTrainCardsText.classList.add("numberOfTrainCardsText");
        numberOfTrainCardsText.innerText = user.numberOfTrainCards;

        let numberOfRoutesText = document.createElement('p');
        numberOfRoutesText.classList.add("numberOfRouteCardsText");
        numberOfRoutesText.innerText = user.numberOfRoutes;

        userEntry.append(userBackdrop);
        userEntry.append(playerName);
        userEntry.append(numberOfCartsText);
        userEntry.append(numberOfStationsText);
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
    } else {
        showAlert("Select cards from your collection first!");
    }
}

function claimEuStation(city) {
    let color = document.getElementsByClassName("activatedCard")[0].id;
    socket.emit('station-claim', {pid: playerID, color: color, city: city, continent: "eu" });
}

function claimUsRoute(routeID) {
    if (document.getElementsByClassName("activatedCard")[0] !== undefined) {
        let color = document.getElementsByClassName("activatedCard")[0].id; 
        socket.emit('route-claim', {pid: playerID, color: color, route: routeID, continent: "us"});
    } else {
        showAlert("Select cards from your collection first!");
    }
}

function markCurrentPlayer(pid) {
    for (let i = 0; i < 8; i++) {
        if (document.getElementById("p" + i) !== null) {
            document.getElementById("p" + i).classList.remove("currentPlayer");
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
        showAlert("Audio unlocked!");
        audioUnlocked = true;
    }).catch(function(){
        showAlert("Audio could not be unlocked. Maybe try again? :)");
    })
}

function endTurn() {
    if (confirm("Do you want to end your turn?")) {
        socket.emit('player-finished');
    }
}

function drawExistingTrains(trains, continent) {
    let imageLocation = document.getElementById(continent);

    // Construct HTML elements
    let carts = document.createElement('img');
    carts.src = `data:image/png;base64,${trains}`;
    carts.classList.add(`${continent}Wagons`);
    imageLocation.append(carts);
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

function showAlert(message) {
    if (document.getElementsByClassName('alert').length === 0) {
        let div = document.createElement('div');
        div.innerText = message;
        div.classList.add('alert');
        document.body.appendChild(div);
        setTimeout(() => {
            document.body.removeChild(div);
        }, 4000);
    }
}

function showStationMenu(data) {
    let cardsContainer = document.getElementById("ownCardContainer");
    let menu = document.getElementById("stationMenu");
    cardsContainer.style.display = "none";
    menu.style.display = "flex";

    if (data.stations.length === 0) {
        let statbox = document.createElement('div');
        statbox.classList.add('stationChoiceDiv');
        let stattext = document.createElement('p');
        stattext.innerText = `Waiting for other players...`;
        stattext.style.margin = 0;
        statbox.append(stattext);
        menu.appendChild(statbox);
    } else {
        for (let station of data.stations) {
            let statbox = document.createElement('div');
            statbox.id = `${station}Choice`;
            statbox.classList.add('stationChoiceDiv');
            let stattext = document.createElement('p');
            stattext.innerText = `Use the station in ${station} to go to: `;
            stattext.style.margin = 0;
            let selector = document.createElement('select');
            for (let desti of data.options[data.stations.indexOf(station)]) {
                let option = document.createElement('option');
                option.value = desti;
                option.innerText = desti;
                selector.appendChild(option);
            }
            statbox.append(stattext, selector);
            menu.append(statbox);
        }
        let confirm = document.createElement('button');
        confirm.innerText = "Confirm!";
        confirm.onclick = function () {
            confirmStations();
        }
        menu.append(confirm);
    }
}

function confirmStations() {
    let stations = document.getElementsByClassName('stationChoiceDiv');
    let routes = [];
    for (let station of stations) {
        routes.push({stationA: station.id.split('Choice')[0], stationB: station.children[1].value, variant: 1, continent: "eu"});
    }
    socket.emit('confirmed-stations', {routes: routes, pid: playerID});
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').children[2].innerText = "Loaded!";
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = 0;
        music.loop = true;
        startsound.play().then(function () {
            music.play();
            audioUnlocked = true;
        }).catch(function (){
            showAlert('To unlock your audio, please press your own player on the left side of the screen!');
        });
        setTimeout(() => {
            document.body.removeChild(document.getElementById('loadingScreen'));
        }, 1000);
    }, 1000);
}