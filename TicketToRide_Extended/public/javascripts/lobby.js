var socket;
var playerID;
var gameID;

var ismuted = false;

var ticketsound = new Howl({
    src: ["../sounds/lobby/PunchTicket.mp3"],
    onplay: () => {
        showMuteButton();
    },
    onend: () => {
        if (!music.playing() && !ismuted) {
            music.play();
        }
    }
});

var music;

function setup(creating) {
    let nameEntered;
    if (creating) {
        if (document.getElementById('createName').value === "") {
            showAlert('Please fill in your name!', 'alert')
            return;
        } else {
            nameEntered = document.getElementById('createName').value.toUpperCase();
        }
    } else {
        if (document.getElementById('joinName').value === "") {
            showAlert('Please fill in your name!', 'alert')
            return;
        } else {
            nameEntered = document.getElementById('joinName').value.toUpperCase();
        }
    }

    let startWinter = new Date(`${new Date().getFullYear()}-03-20`);
    let endWinter = new Date(`${new Date().getFullYear()}-03-20`);
    let now = new Date();

    if (now > endWinter || now > startWinter) {
        particlesJS.load('particles-js', '../config/particles.json', function() {
            music = new Howl({
                src: ["../sounds/lobby/Menu.mp3"],
                loop: true,
                onplay: () => {
                    changeMuteButton(true);
                },
            });
        });
    } else {
        particlesJS.load('particles-js', '../config/particles-snow.json', function() {
            music = new Howl({
                src: ["../sounds/lobby/WinterMenu.mp3"],
                loop: true,
                onplay: () => {
                    changeMuteButton(true);
                },
            });
        });
    }

    // Change lobby bg
    document.getElementById("bg-pale").style.opacity = 0;

    // Setup the socket.io connection
    socket = io(location.host);

    if (creating) {
        // Get the options defined
        let euEnabled = document.getElementById('continentEU').checked;
        let usEnabled = document.getElementById('continentUS').checked;
        let amountOfTrains = Number(document.getElementById('amountOfTrains').value);

        console.log('Creating an awesome game!');
        socket.emit('create-game', {eu: euEnabled, us: usEnabled, amount: amountOfTrains});
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
        document.getElementById('gidDisplay').innerText = gameID;

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
        ticketsound.play();
        addUsers(players);
    });

    socket.on('start-game', () => {
        window.location.pathname = '/play';
    });

	socket.on('invalid-game', () => {
		showAlert('That game does not exist!', 'alert');
    });

    socket.on('something-went-wrong', (message) => {
        if (message === undefined) {
            showAlert('Oops! Something went wrong! Please try again!', 'alert');
        } else {
            showAlert(message, 'alert');
        }
    })
}

function back() {
    document.getElementById('options').style.display = 'flex';
    document.getElementById('joinWindow').style.display = 'none';
    document.getElementById('createWindow').style.display = 'none';
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
        let userEntry = document.createElement('div');
        let userEntryName = document.createElement('h3');
        userEntry.classList.add('badge');
        userEntry.classList.add('playerBubble');
        userEntryName.classList.add('playerBubbleName');
        userEntryName.innerText = user.name;
        userEntry.append(userEntryName);
        userBox.prepend(userEntry);
    }
}

function startGame() {
    socket.emit('start-game');
}

function showMuteButton() {
    let mutediv = document.getElementById("mute");
    mutediv.style.display = "block";
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
        music.stop();
        ismuted = true;
    } else {
        changeMuteButton(true);
        music.play();
        ismuted = false;
    }
}