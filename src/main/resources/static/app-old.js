var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
        $("#connect").hide();
        $("#disconnect").show();
        $("#interaction").show();
    }
    else {
        $("#conversation").hide();
        $("#connect").show();
        $("#disconnect").hide();
        $("#interaction").hide();
    }
    $("#chat").html("");

    fetch('http://localhost:8080/users').then((response) => {
        console.log(response);
        response.json().then((users) => {
            showUsers(users);
        });
    });
}

function connect() {
    var username = window.localStorage.getItem('user.id');
    if (username == null || username == "") {
         username = prompt('Username');
    } else {
        console.log(username);
    }
    var socket = new SockJS('/whatsapp');
     stompClient = Stomp.over(socket);
     stompClient.connect({}, function (frame) {
     setConnected(true);
     console.log('Connected: ' + frame);
     stompClient.subscribe('/topic/all', function (message) {
         showMessage(JSON.parse(message.body));
     });
     register(username);
    });

}

function disconnect() {
    window.localStorage.clear();
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function register(username) {
    fetch('http://localhost:8080/register', { method : 'POST',
                                                  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                                  body : JSON.stringify({'id': username, 'name': username})})
        .then((response) => {
            response.json().then((user) => {
                window.localStorage.setItem('user.id', user.id);
            });
        });
    stompClient.subscribe('/topic/'+ username, function (message) {
                showMessage(JSON.parse(message.body));
                });
}

function send() {
    if(window.localStorage.getItem('user.id') == null) {
        disconnect();
        return;
    }
    stompClient.send("/app/send", {}, JSON.stringify({'message': $("#message").val(), 'from': window.localStorage.getItem('user.id'), 'to': $("#to").val()}));
}

function showMessage(message) {
    $("#chat").append("<tr><td>" + message.from + "</td><td>" + message.to + "</td><td>" + message.message + "</td></tr>");
}

function showUsers(users) {
   users.forEach(user => showMessage({'from' : user + "-" + user, 'to' : 'ALL', 'message' : 'joined'}));
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { send(); });
    if(window.localStorage.getItem('user.id') != null) {
        connect();
        return;
    }

    $("#connect").show();
    $("#disconnect").hide();
    $("#conversation").hide();
    $("#interaction").hide();


});