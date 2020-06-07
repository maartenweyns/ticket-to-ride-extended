var socket;
var playerID;
var gameID;

function setup(creating) {
    let nameEntered;
    if (creating) {
        if (document.getElementById('createName').value === "") {
            showAlert('Please fill in your name!')
            return;
        } else {
            nameEntered = document.getElementById('createName').value.toUpperCase();
        }
    } else {
        if (document.getElementById('joinName').value === "") {
            showAlert('Please fill in your name!')
            return;
        } else {
            nameEntered = document.getElementById('joinName').value.toUpperCase();
        }
    }

    // Setup the socket.io connection
    socket = io(location.host);

    if (creating) {
        console.log('Creating an awesome game!');
        socket.emit('create-game');
    } else {
        console.log('Joining your friends!');
        // Send the player's name to the server
        socket.emit('player-name', {name: nameEntered, gid: document.getElementById('gameID').value.toUpperCase()});
    }

    socket.on('join', (gid) => {
        // Send the player's name to the server
        socket.emit('player-name', {name: nameEntered, gid: gid});
    })

    socket.on('information', (data) => {
        playerID = data.playerID;
        gameID = data.gameID;
        document.getElementById('gidDisplay').innerText = `You are in game ${gameID}`;

        // Setup the cookies
        let expires = new Date();
        expires.setDate(expires.getDate() + 8);
        document.cookie = "playerID=" + playerID + "; expires=" + expires;
        expires.setDate(expires.getDate() + 8);
        document.cookie = "gameID=" + gameID + "; expires=" + expires;

        // Setup the lobby
        document.getElementById('joinWindow').style.display = 'none';
        document.getElementById('createWindow').style.display = 'none';
        document.getElementById('options').style.display = 'none';
        document.getElementById('players').style.display = 'block';
        if (playerID === 0) {
            document.getElementById('startGame').style.display = 'block';
        }
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
    
    socket.on('game-full', () => {
        showAlert('That game is already full!');
    });
}

function join() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('joinWindow').style.display = 'flex';
}

function create() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('createWindow').style.display = 'flex';
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