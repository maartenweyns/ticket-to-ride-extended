function requestDestination() {
    let msg1 = Messages.O_PLAYER_TOOK_DESTINATION;
    msg1.data = playerID;
    socket.send(JSON.stringify(msg1));
}

function receivedDestinations(data) {
    alert(data);
}