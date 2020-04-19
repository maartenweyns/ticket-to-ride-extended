var socket;

if (document.location.protocol === "https:" || document.location.protocol === "https:") {
    socket = new WebSocket("wss://" + location.host);
} else {
    socket = new WebSocket("ws://" + location.host);
}

(function setup() {
    document.getElementById("defaultOpen").click();

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        console.log("incomingMsg: " + JSON.stringify(incomingMsg));

        // if (incomingMsg.type === Messages.T_PLAYER_NAME) {
        //     var name = prompt("Please enter your name:");
        //     let msg = Messages.O_PLAYER_NAME;
        //     msg.data = name;
        //     socket.send(JSON.stringify(msg));
        // }

        if (incomingMsg.type === Messages.T_OPEN_CARDS) {
            setOpenTickets(incomingMsg.data);
        }
    };
})();
