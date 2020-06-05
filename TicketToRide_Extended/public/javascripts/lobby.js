var socket;
var playerID;
var gameID;

document.getElementById('playername').addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        setup();
    }
});

function setup(creating) {
    if (document.getElementById('playername').value === "") {
        showAlert('Please fill in your name!')
        return;
    }

    // Setup the socket.io connection
    socket = io(location.host);

    if (creating) {
        console.log('Creating an awesome game!');
        socket.emit('create-game');
    } else {
        console.log('Joining your friends!');
        // Send the player's name to the server
        socket.emit('player-name', {name: document.getElementById('playername').value, gid: document.getElementById('gameID').value});
    }

    socket.on('join', (gid) => {
        // Send the player's name to the server
        socket.emit('player-name', {name: document.getElementById('playername').value, gid: gid});
    })

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
        document.getElementById('playerLogin').style.display = 'none';
        document.getElementById('gameID').style.display = 'none';
        document.getElementById('createbutton').style.display = 'none';
        document.getElementById('startbutton').innerText = 'START GAME';
        document.getElementById('startbutton').onclick = function() {
            startGame();
        }
        // let audio = new Audio("sounds/MenuMusic.mp3");
        // audio.loop = true;
        // audio.play();
    });

    socket.on('player-overview', (players) => {
        addUsers(players);
    });

    socket.on('start-game', () => {
        window.location.pathname = '/play';
    });

    socket.on('game-ongoing', () => {
		showAlert('This game has already started!');
    });

	socket.on('invalid-game', () => {
		showAlert('That game does not exist!');
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
