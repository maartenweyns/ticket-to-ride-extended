var socket;
var playerID;
var gameID;

const swup = new Swup();

function setup() {
    if (document.getElementById('playername').value === "") {
        document.getElementById('playername').classList.add("warning");
        return;
    }

    // Setup the socket.io connection
    socket = io(location.host);
    // Send the player's name to the server
    socket.emit('player-name', document.getElementById('playername').value);

    socket.on('information', (data) => {
        playerID = data.playerID;
        gameID = data.gameID;

        // Setup the cookies
        let expires = new Date();
        expires.setDate(expires.getDate() + 8);
        document.cookie = "playerID=" + playerID + "; expires=" + expires;
        expires.setDate(expires.getDate() + 8);
        document.cookie = "gameID=" + gameID + "; expires=" + expires;

        // Setup the lobby
        document.getElementById('playername').style.display = 'none';
        document.getElementById('startbutton').innerText = 'START GAME';
        document.getElementById('startbutton').onclick = function() {
            startGame();
        }
        let audio = new Audio("sounds/MenuMusic.mp3");
        audio.loop = true;
        audio.play();
    });

    socket.on('player-overview', (players) => {
        addUsers(players);
    });

    socket.on('start-game', () => {
        window.location.pathname = '/play';
    });
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
    socket.emit('start-game');
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

