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