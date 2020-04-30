var socket;
var playerID;

const swup = new Swup();

function setup() {
    if (document.getElementById('playername').value === "") {
        document.getElementById('playername').classList.add("warning");
        return;
    }

    if (document.location.protocol === "https:" || document.location.protocol === "https:") {
        socket = new WebSocket("wss://" + location.host);
    } else {
        socket = new WebSocket("ws://" + location.host);
    }

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("incomingMsg: " + JSON.stringify(incomingMsg));

        if (incomingMsg.type === Messages.T_LOBBY) {
            alert("The game has already started!");
            window.location.pathname = '/';
            return;
        }

        if (incomingMsg.type === Messages.T_PLAYER_NAME) {
            playerID = incomingMsg.data.pid;

            let expires = new Date();
            expires.setDate(expires.getDate() + 8);
            document.cookie = "playerID=" + playerID + "; expires=" + expires;
            expires.setDate(expires.getDate() + 8);
            document.cookie = "gameID=" + incomingMsg.data.gid + "; expires=" + expires;
            sendName();
        }

        if (incomingMsg.type === Messages.T_PLAYER_OVERVIEW) {
            addUsers(incomingMsg.data);
        }

        if (incomingMsg.type === Messages.T_GAME_START) {
            window.location.pathname = '/play'
        }
    };
}

function sendName() {
    let name = document.getElementById('playername').value;
    document.getElementById('playername').style.display = 'none';
    document.getElementById('startbutton').innerText = 'START GAME';
    document.getElementById('startbutton').onclick = function() {
        startGame();
    }
    let msg = Messages.O_PLAYER_NAME;
    msg.data = {pName: name, pID: playerID};
    socket.send(JSON.stringify(msg));

    let audio = new Audio("sounds/MenuMusic.mp3");
    audio.loop = true;
    audio.play();
}

function addUsers(users) {
    let userBox = document.getElementsByClassName("circles")[0];
    userBox.innerHTML = '';
    while (users.length !== 0) {
        let user = users.pop();
        let userEntry = document.createElement('li');
        userEntry.innerText = user.name;
        userBox.prepend(userEntry);
    }
}

function startGame() {
    let msg = Messages.O_GAME_START;
    socket.send(JSON.stringify(msg));
}

particlesJS.load('particles-js', '../config/particles.json', function() {
    console.log('callback - particles.js config loaded');
});

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

