var playerID;
var socket;

var playersDrawn = false;

if (document.location.protocol === "https:" || document.location.protocol === "https:") {
    socket = new WebSocket("wss://" + location.host);
} else {
    socket = new WebSocket("ws://" + location.host);
}

(function setup() {
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
    };
})();

function createPlayers(data) {

    for (let player of data) {
        let div = document.createElement('div');
        div.classList.add('playerDiv');
        document.body.append(div);

        let playername = document.createElement('p');
        playername.innerText = player.name;
        playername.classList.add("text");

        let score = document.createElement('p');
        score.innerText = "Score: " + player.score;
        score.classList.add("text");

        div.append(playername, score);
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