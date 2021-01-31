var playerID;
var gameID;
var socket;

var playersDrawn = false;
var scoresDrawn = false;

var movingTrain = new Howl({
    src: ["./sounds/movingTrain_1s.mp3"],
});
var music = new Howl({
    src: ["./sounds/lastTurnMusic.mp3"],
});
var happymusic = new Howl({
    loop: true,
    src: ["./sounds/germanMusic.mp3"],
});
var winning = new Howl({
    src: ["./sounds/victoryJingle.mp3"],
    onend: function() {
        happymusic.play();
    }
});
var vapeur = new Howl({
    src: ["./sounds/Vapeur.mp3"],
});

socket = io(location.host);

(function setup() {

    playerID = parseInt(getCookie("playerID"));
    gameID = getCookie("gameID");
    music.play();

    socket.on('connect', () => {
        console.log("Connceted to server");
        socket.emit('request-scoring', {gameID: gameID});
    });

    socket.on('player-overview', (players) => {
        if (!playersDrawn) {
            createPlayers(players);
            playersDrawn = true;
        }
    });

    socket.on('final-score', (data) => {
        if (!scoresDrawn) {
            document.body.removeChild(document.getElementById('loadingScreen'));
            showScoresNew(data);
            scoresDrawn = true;
        }
    });

    socket.on('lobby', () => {
        window.location.pathname = '/';
    });

    socket.on('play', () => {
        window.location.pathname = '/play';
    })
})();

function createPlayers(data) {
    for (let player of data) {
        let div = document.createElement('div');
        div.classList.add('playerDiv');
        div.id = "box" + player.id;
        document.body.append(div);

        let general = document.createElement('div');
        general.classList.add('generalDiv');

        let playername = document.createElement('h2');
        playername.innerText = player.name;
        playername.classList.add("text");

        let infodiv = document.createElement('div');
        infodiv.classList.add('infodiv');
        infodiv.id = "infodiv" + player.id;
        // infodiv.append(completedRoutes, uncompletedRoutes);

        let score = document.createElement('h2');
        score.innerText = "Score: " + player.score;
        score.id = "score" + player.id;
        score.classList.add("text");
        score.classList.add("playerscore");

        general.append(playername, infodiv, score);

        let traindiv = document.createElement('div');
        traindiv.classList.add('trainDiv');
        let train = document.createElement('img');
        train.src = "./images/scoreTrains/score-train-Blue.png";
        train.classList.add("scoreTrain");
        train.classList.add(player.color + "Wagons");
        train.id = "scoreTrain" + player.id;

        train.style.transform = "translateX(calc(-100% + " + 0.5*player.score + "%))";

        traindiv.append(train);

        div.append(general, traindiv);
    }
    // document.getElementById("box0").classList.add("currentlyCalculating");
}

function showScoresNew (data) {
    let wait = 1;
    for (let i = 0; i < data.length; i++) {
        let last = false;
        let player = data[i];
        if (i === data.length - 1) {
            last = true;
        }

        for (let j = 0; j < player.completedDestinations.length; j++) {
            setTimeout(() => {
                let score = parseInt(document.getElementById("score" + player.id).innerText.split("Score: ")[1]);
                let destination = player.completedDestinations[j];
                score += destination.points;

                let routecard = document.createElement('div');
                let overlay = document.createElement('img');
                overlay.src = './images/decorations/ticket-DoneFrame.png';
                overlay.classList.add('overlay');
                let cardimage = document.createElement('img');
                cardimage.src = './images/routeCards/' + destination.continent + '-' + destination.stationA + '-' + destination.stationB + '.png';
                cardimage.classList.add('routecardimage');
                routecard.classList.add('routeCard');
                routecard.append(cardimage, overlay);

                document.getElementById("infodiv" + player.id).append(routecard);

                document.getElementById("score" + player.id).innerText = "Score: " + score;
                document.getElementById("scoreTrain" + player.id).style.transform = "translateX(calc(-100% + " + score + "%))";

                vapeur.play();
                movingTrain.play();

            }, 2000 * wait++); 
        }
        
        for (let j = 0; j < player.destinations.length; j++) {
            setTimeout(() => {
                let score = parseInt(document.getElementById("score" + player.id).innerText.split("Score: ")[1]);
                let destination = player.destinations[j];
                score -= destination.points;

                let routecard = document.createElement('div');
                let overlay = document.createElement('img');
                overlay.src = './images/decorations/ticket-ToDoFrame.png';
                overlay.classList.add('overlay');
                let cardimage = document.createElement('img');
                cardimage.src = './images/routeCards/' + destination.continent + '-' + destination.stationA + '-' + destination.stationB + '.png';
                cardimage.classList.add('routecardimage');
                routecard.classList.add('routeCard');
                routecard.append(cardimage, overlay);

                document.getElementById("infodiv" + player.id).append(routecard);

                document.getElementById("score" + player.id).innerText = "Score: " + score;
                document.getElementById("scoreTrain" + player.id).style.transform = "translateX(calc(-100% + " + score + "%))";

                vapeur.play();
                movingTrain.play();
            }, 2000 * wait++); 
        }

        for (let k = 0; k < player.stations; k++) {
            setTimeout(() => {
                let score = parseInt(document.getElementById("score" + player.id).innerText.split("Score: ")[1]);
                score += 4;

                // let routecard = document.createElement('div');
                // let overlay = document.createElement('img');
                // overlay.src = './images/decorations/ticket-ToDoFrame.png';
                // overlay.classList.add('overlay');
                // let cardimage = document.createElement('img');
                // cardimage.src = './images/routeCards/' + destination.continent + '-' + destination.stationA + '-' + destination.stationB + '.png';
                // cardimage.classList.add('routecardimage');
                // routecard.classList.add('routeCard');
                // routecard.append(cardimage, overlay);

                // document.getElementById("infodiv" + player.id).append(routecard);

                document.getElementById("score" + player.id).innerText = "Score: " + score;
                document.getElementById("scoreTrain" + player.id).style.transform = "translateX(calc(-100% + " + score + "%))";

                vapeur.play();
                movingTrain.play();
            }, 2000 * wait++); 
        }

        if (last) {
            setTimeout(function () {
                showWinning();
                music.pause();
                winning.play();
            }, 2000 * wait);
        }

    }
}

function showWinning() {
    let scores = document.getElementsByClassName('playerscore');
    let highestscore = -Infinity;
    let highestpid;
    for (let score of scores) {
        let actual = parseInt(score.innerText.split("Score: ")[1]);
        if (actual > highestscore) {
            highestpid = parseInt(score.id.split("score")[1]);
            highestscore = actual;
        }
    }

    document.getElementById("box" + highestpid).classList.add("winningPlayer");
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