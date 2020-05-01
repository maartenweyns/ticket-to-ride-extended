var playerID;
var socket;

var playersDrawn = false;

var movingTrain = new Audio("./sounds/movingTrain_1s.mp3");
var music = new Audio("./sounds/lastTurnMusic.mp3");
var happymusic = new Audio("./sounds/germanMusic.mp3");

if (document.location.protocol === "https:" || document.location.protocol === "https:") {
    socket = new WebSocket("wss://" + location.host);
} else {
    socket = new WebSocket("ws://" + location.host);
}

(function setup() {

    music.play();

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("incomingMsg: " + JSON.stringify(incomingMsg));

        if (incomingMsg.type === Messages.T_PLAYER_NAME) {
            playerID = parseInt(getCookie("playerID"));

            let conid = incomingMsg.data.pid;

            let msg = Messages.O_PLAYER_EXISTING_ID;
            msg.data = {pid: playerID, conId: conid, gid: getCookie("gameID")};
            socket.send(JSON.stringify(msg));
        }

        if (!playersDrawn && incomingMsg.type === Messages.T_PLAYER_OVERVIEW) {
            createPlayers(incomingMsg.data);
            playersDrawn = true;
        }

        if (incomingMsg.type === Messages.T_FINAL_SCORE){
            showScores(incomingMsg.data);
        }
    };
})();

function createPlayers(data) {
    let winningplayer = data[0];
    for (let player of data) {
        if (player.score > winningplayer.score) {
            winningplayer = player;
        }
    }

    for (let player of data) {
        let div = document.createElement('div');
        div.classList.add('playerDiv');
        div.id = "box" + player.id;
        if (player === winningplayer) {
            div.classList.add('winningPlayer');
        }
        document.body.append(div);

        let general = document.createElement('div');
        general.classList.add('generalDiv');

        let playername = document.createElement('p');
        playername.innerText = player.name;
        playername.classList.add("text");

        let infodiv = document.createElement('div');
        let completedRoutes = document.createElement('p');
        let uncompletedRoutes = document.createElement('p');
        completedRoutes.innerText = "Routes completed: ";
        uncompletedRoutes.innerText = "Routes not completed: ";
        infodiv.classList.add('infodiv');
        completedRoutes.classList.add('smallInfo');
        uncompletedRoutes.classList.add('smallInfo');
        completedRoutes.id = "completed" + player.id;
        uncompletedRoutes.id = "uncompleted" + player.id;
        infodiv.append(completedRoutes, uncompletedRoutes);

        let score = document.createElement('p');
        score.innerText = "Score: " + player.score;
        score.id = "score" + player.id;
        score.classList.add("text");

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
    document.getElementById("box0").classList.add("currentlyCalculating");
}

function showScores(data) {
    for (let i = 0; i < data.length; i++) {
        let last = false;
        let player = data[i];
        if (i === data.length - 1) {
            last = true;
        }

        setTimeout(function() {
            let score = parseInt(document.getElementById("score" + player.id).innerText.split("Score: ")[1]);

            for (let destination of player.completedDestinations) {
                score += destination.points;
            }
    
            for (let destination of player.destinations) {
                score -= destination.points;
            }
            document.getElementById("score" + player.id).innerText = "Score: " + score;
            document.getElementById("scoreTrain" + player.id).style.transform = "translateX(calc(-100% + " + 0.5*score + "%))";

            document.getElementById("completed" + player.id).innerText = "Routes completed: " + player.completedDestinations.length;
            document.getElementById("uncompleted" + player.id).innerText = "Routes  not completed: " + player.destinations.length;

            movingTrain.play();

            document.getElementById("box" + player.id).classList.remove("currentlyCalculating");

            if (!last) {
                document.getElementById("box" + (player.id + 1)).classList.add("currentlyCalculating");
            } else {
                setTimeout(function () {
                    music.pause();
                    happymusic.loop = true;
                    happymusic.play();
                }, 1000);
            }
        }, 2000*(i + 1));
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