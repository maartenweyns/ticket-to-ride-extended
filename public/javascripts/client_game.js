var socket;
var playerID;
var gameID;
var currentMove;

var ismuted = true;
changeMuteButton(false);

var sfxmuted = true;
changeSfxMuteButton(false);

var ticketsound = new Howl({ src: ["../sounds/lobby/PunchTicket.mp3"] });

var cardDeal = new Howl({ src: ["../sounds/card_dealt3.mp3"] });

var music = new Howl({
    src: ["../sounds/america.mp3"],
    loop: true,
});

var startsound = new Howl({
    src: ["../sounds/startGame.mp3"],
    onplay: function () {
        music.play();
    },
});

var buzz = new Howl({ src: ["../sounds/IG_F_Cant.mp3"] });
var cardShuffle = new Howl({ src: ["../sounds/card_shuffling3.mp3"] });
var cashRegister = new Howl({ src: ["../sounds/cash_register3.mp3"] });

var ticketCompleted = new Howl({
    src: ["../sounds/ticketCompletedVictory.mp3"],
    onplay: function () {
        ticketsound.play();
    }
});

var trainHorn = new Howl({ src: ["../sounds/train_horn2.mp3"] });
var differentContinent = new Howl({ src: ["../sounds/differentContinent.mp3"] });

var lastRoundShown = false;

var gameoptions = undefined;

socket = io(location.host);

(function setup() {
    playerID = parseInt(getCookie("playerID"));
    gameID = getCookie("gameID");

    // Disable game elements from users
    document.getElementById("endTurn").style.display = "none";

    socket.on("connect", () => {
        console.log("Connceted to server");
        socket.emit("player-ingame-join", {
            playerID: playerID,
            gameID: gameID,
        });
    });

    socket.on("open-cards", (cardData) => {
        let shuffle = JSON.parse(cardData.shuffle);
        if (!shuffle) {
            setOpenTickets(cardData.cards);
        } else {
            shufflecards(cardData.cards);
        }
    });

    socket.on("own-cards", (cards) => {
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

    socket.on("game-options", (options) => {
        gameoptions = options;
        configureGame(options);
    });

    socket.on("initial-routes", (routes) => {
        receivedDestinations(routes, routes.length, true);
    });

    socket.on("validate-first-destinations", () => {
        confirmDestis(false);
    });

    socket.on("player-overview", (players) => {
        addUsers(players);
    });

    socket.on("player-round", (round) => {
        player = parseInt(round.pid);

        if (!lastRoundShown && round.lastRound) {
            lastRoundShown = true;
            showAlert(
                "A player has less than 3 wagons! This is the last round!",
                "alert"
            );
        }

        currentMove = parseInt(round.thing);
        markCurrentPlayer(player);

        if (currentMove === 0) {
            enableLocomotives();
            document.getElementById("endTurn").style.display = "none";
        }

        if (player === playerID && currentMove === 0) {
            if (!sfxmuted) trainHorn.play();
        }

        if (player === playerID && currentMove !== 0) {
            document.getElementById("endTurn").style.display = "flex";
        }
    });

    socket.on("new-open-card", (data) => {
        if (data.pid === playerID) {
            replaceCard(data.repCard, data.newColor, true);
        } else {
            replaceCard(data.repCard, data.newColor, false);
        }
        if (!document.getElementById(data.repCard).classList.contains("loco")) {
            disableLocomotives();
        }
    });

    socket.on("closed-train", () => {
        if (!sfxmuted) cardDeal.play();
        document
            .getElementById("closedCard")
            .classList.add("cardTakenSelf", "disabled");
        setTimeout(function () {
            document
                .getElementById("closedCard")
                .classList.remove("cardTakenSelf", "disabled");
        }, 1000);
    });

    socket.on("closed-move", (data) => {
        if (data.move === "TRAIN-CARD") {
            if (!sfxmuted) cardDeal.play();
            document
                .getElementById("closedCard")
                .classList.add("cardTaken", "disabled");
            setTimeout(function () {
                document
                    .getElementById("closedCard")
                    .classList.remove("cardTaken", "disabled");
            }, 1000);
        }
        if (data.move === "ROUTE-CARD") {
            if (!sfxmuted) cardDeal.play();
            document
                .getElementById("routeCard")
                .classList.add("cardTaken", "disabled");
            setTimeout(function () {
                document
                    .getElementById("routeCard")
                    .classList.remove("cardTaken", "disabled");
            }, 1000);
        }
    });

    socket.on("mapitem", (data) => {
        if (document.getElementsByClassName(`${data.continent}Wagons`).length < 1) {
            // There is no existing wagon image
            let imageLocation = document.getElementById(data.continent);
            // Construct HTML elements
            let carts = document.createElement("img");
            carts.src = `data:image/png;base64,${data.image}`;
            carts.classList.add(`${data.continent}Wagons`);
            carts.classList.add("cartsBlinking");
            setTimeout(function () {
                carts.classList.remove("cartsBlinking");
            }, 4000);
            imageLocation.append(carts);
        } else {
            // Set the new image
            let carts = document.getElementsByClassName(`${data.continent}Wagons`)[0];
            carts.src = `data:image/png;base64,${data.image}`;
            carts.classList.add("cartsBlinking");
            setTimeout(function () {
                carts.classList.remove("cartsBlinking");
            }, 4000);
        }

        // Play the cash register sound
        if (document.getElementById(data.continent).style.display === "block") {
            if (!sfxmuted) cashRegister.play();
        } else {
            if (!sfxmuted) differentContinent.play();
            let tab = document.getElementById(data.continent + "tab");
            tab.classList.add("flashingFlag");
            setTimeout(function () {
                tab.classList.remove("flashingFlag");
            }, 1600);
        }

        document.getElementById("loadingTrains").style.opacity = "0";
    });

    socket.on("route-claim", (data) => {
        if (data.status === "alreadyClaimedThis") {
            showAlert(
                `You cannot do an action on ${data.continent} anymore!`,
                "alert"
            );
            document.getElementById("loadingTrains").style.opacity = "0";
        } else if (data.status === "cant") {
            if (!sfxmuted) buzz.play();
            let card = document.getElementsByClassName("activatedCard")[0];
            card.classList.add("cantCard");
            setTimeout(function () {
                card.classList.remove("cantCard");
            }, 400);
            document.getElementById("loadingTrains").style.opacity = "0";
        } else if (data.status === "notYourTurn") {
            showAlert("It is currently not your turn!", "alert");
            document.getElementById("loadingTrains").style.opacity = "0";
        }
    });

    socket.on("invalidmove", (data) => {
        showAlert(data.message, "alert");
        document.getElementById("loadingTrains").style.opacity = "0";
    });

    socket.on("own-destinations", (data) => {
        drawOwnDestinations(data.uncompleted, false);
        drawOwnDestinations(data.completed, true);
    });

    socket.on("existing-trains", (data) => {
        for (let continent in data) {
            console.log(`Drawing on ${continent}`);
            drawExistingTrains(data[continent], continent);
        }
    });

    socket.on("player-destination", (data) => {
        if (!sfxmuted) cardDeal.play();
        receivedDestinations(data, 3, false);
    });

    socket.on("player-completed-route", (data) => {
        if (!sfxmuted) ticketCompleted.play();
        completedRoute(data);
    });

    socket.on("station-claim", (result) => {
        if (!result) {
            showAlert("You cannot place a station here!", "alert");
        }
    });

    socket.on("stations", (data) => {
        document.getElementById("endTurn").style.display = "none";
        document
            .getElementById("generalCards")
            .classList.add("generalCardsAway");
        showStationMenu(data);
    });

    socket.on("game-end", () => {
        window.location.pathname = "/score";
    });

    socket.on("lobby", () => {
        window.location.pathname = "/";
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
        showAlert(
            "You are disconnected. The app will try to reconnect automatically",
            "warning"
        );
    });

    socket.on("reconnect_attempt", () => {
        console.log("Trying to reconnect");
        showAlert("Trying to reconnect...", "info");
    });

    socket.on("error", () => {
        console.log("Something went wrong with the connection");
        showAlert(
            "Something went wrong with the connection! Reloading the page can fix this.",
            "warning"
        );
    });
})();

function configureGame(options) {
    if (!options.eu) {
        let eumap = document.getElementById("eu");
        let eutab = document.getElementById("eutab");

        eumap.parentNode.removeChild(eumap);
        eutab.parentNode.removeChild(eutab);

        document.getElementById("ustab").click();
        return;
    }
    if (!options.us) {
        let usmap = document.getElementById("us");
        let ustab = document.getElementById("ustab");

        usmap.parentNode.removeChild(usmap);
        ustab.parentNode.removeChild(ustab);

        document.getElementById("eutab").click();
        return;
    }
    // Open EU when both continents are participating
    document.getElementById("eutab").click();
}

function addUsers(users) {
    let userBox = document.getElementById("userBox");
    userBox.innerHTML = "";
    while (users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement("div");
        userEntry.classList.add("playerBackdrop");
        userEntry.id = "p" + user.id;

        let userBackdrop = document.createElement("img");
        userBackdrop.src = "images/playerInformation/" + user.color + ".png";
        userBackdrop.classList.add("playerBackdropImage");

        let playerName = document.createElement("p");
        playerName.innerText = user.name + "(" + user.score + ")";
        playerName.classList.add("playerName");

        let numberOfCartsText = document.createElement("p");
        numberOfCartsText.classList.add("numberOfCartsText");
        numberOfCartsText.innerText = user.numberOfTrains;

        let numberOfStationsText = document.createElement("p");
        numberOfStationsText.classList.add("numberOfStationsText");
        numberOfStationsText.innerText = user.numberOfStations;

        let numberOfTrainCardsText = document.createElement("p");
        numberOfTrainCardsText.classList.add("numberOfTrainCardsText");
        numberOfTrainCardsText.innerText = user.numberOfTrainCards;

        let numberOfRoutesText = document.createElement("p");
        numberOfRoutesText.classList.add("numberOfRouteCardsText");
        numberOfRoutesText.innerText = user.numberOfRoutes;

        userEntry.append(userBackdrop);
        userEntry.append(playerName);
        userEntry.append(numberOfCartsText);
        userEntry.append(numberOfStationsText);
        userEntry.append(numberOfTrainCardsText);
        userEntry.append(numberOfRoutesText);
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
        socket.emit("route-claim", {
            pid: playerID,
            color: color,
            route: routeID,
            continent: "eu",
        });
        document.getElementById("loadingTrains").style.opacity = "1";
    } else {
        showAlert("Select cards from your collection first!", "alert");
    }
}

function claimEuStation(city) {
    let color = document.getElementsByClassName("activatedCard")[0].id;
    socket.emit("station-claim", {
        pid: playerID,
        color: color,
        city: city,
        continent: "eu",
    });
    document.getElementById("loadingTrains").style.opacity = "1";
}

function claimUsRoute(routeID) {
    if (document.getElementsByClassName("activatedCard")[0] !== undefined) {
        let color = document.getElementsByClassName("activatedCard")[0].id;
        socket.emit("route-claim", {
            pid: playerID,
            color: color,
            route: routeID,
            continent: "us",
        });
        document.getElementById("loadingTrains").style.opacity = "1";
    } else {
        showAlert("Select cards from your collection first!", "alert");
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

function endTurn() {
    socket.emit("player-finished");
}

function drawExistingTrains(trains, continent) {
    let imageLocation = document.getElementById(continent);

    // Construct HTML elements
    let carts = document.createElement("img");
    carts.src = `data:image/png;base64,${trains}`;
    carts.classList.add(`${continent}Wagons`);
    imageLocation.append(carts);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showStationMenu(data) {
    let cardsContainer = document.getElementById("ownCardContainer");
    let menu = document.getElementById("stationMenu");
    cardsContainer.style.display = "none";
    menu.style.display = "flex";

    if (data.stations.length === 0) {
        let statbox = document.createElement("div");
        statbox.classList.add("stationChoiceDiv");
        let stattext = document.createElement("p");
        stattext.innerText = `Waiting for other players...`;
        stattext.style.margin = 0;
        statbox.append(stattext);
        menu.appendChild(statbox);
    } else {
        for (let station of data.stations) {
            let statbox = document.createElement("div");
            statbox.id = `${station}Choice`;
            statbox.classList.add("stationChoiceDiv");
            let stattext = document.createElement("p");
            stattext.innerText = `Use the station in ${station} to go to: `;
            stattext.style.margin = 0;
            let selector = document.createElement("select");
            for (let desti of data.options[data.stations.indexOf(station)]) {
                let option = document.createElement("option");
                option.value = desti;
                option.innerText = desti;
                selector.appendChild(option);
            }
            statbox.append(stattext, selector);
            menu.append(statbox);
        }
        let confirm = document.createElement("button");
        confirm.classList.add("styledButton");
        confirm.innerText = "Confirm!";
        confirm.onclick = function () {
            confirmStations();
        };
        menu.append(confirm);
    }
}

function confirmStations() {
    let stations = document.getElementsByClassName("stationChoiceDiv");
    let routes = [];
    for (let station of stations) {
        routes.push({
            stationA: station.id.split("Choice")[0],
            stationB: station.children[1].value.toLowerCase(),
            continent: "eu",
        });
    }
    socket.emit("confirmed-stations", { routes: routes, pid: playerID });
}

function hideLoadingScreen() {
    document.getElementById("loadingScreen").children[2].innerText = "Loaded!";
    setTimeout(() => {
        document.getElementById("loadingScreen").style.opacity = 0;
        music.loop = true;
        if (!sfxmuted) startsound.play();
        setTimeout(() => {
            document.body.removeChild(document.getElementById("loadingScreen"));
        }, 1000);
    }, 1000);
}

/**
 * This function will change the mute button. True is on, false is off
 */
function changeMuteButton(status) {
    let mutebutton = document.getElementById("mutebtn");

    if (status) {
        mutebutton.src = "../images/buttons/sound/button-music-On.png";
    } else {
        mutebutton.src = "../images/buttons/sound/button-music-Off.png";
    }
}

function mute() {
    if (music.playing()) {
        changeMuteButton(false);
        music.pause();
        ismuted = true;
    } else {
        changeMuteButton(true);
        music.play();
        ismuted = false;
    }
}

/**
 * This function will change the mute button. True is on, false is off
 */
function changeSfxMuteButton(status) {
    let mutebutton = document.getElementById("sfxmutebtn");

    if (status) {
        mutebutton.src = "../images/buttons/sound/button-sound-On.png";
    } else {
        mutebutton.src = "../images/buttons/sound/button-sound-Off.png";
    }
}

function sfxmute() {
    if (!sfxmuted) {
        changeSfxMuteButton(false);
        sfxmuted = true;
    } else {    
        changeSfxMuteButton(true);
        sfxmuted = false;
        ticketsound.play();
    }
}