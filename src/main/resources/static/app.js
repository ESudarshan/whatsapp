var stompClient = null;
var serverAddress="http://192.168.2.9:8080";

function setConnected(connected) {
    if (connected) {
        $("#login").hide();
        $("#logout").show();
        $("#signup").hide();
        $("#username").show();
        $("#users").show();
    }
    else {
        $("#login").show();
        $("#logout").hide();
        $("#signup").show();
        $("#username").hide();
        $("#users").hide();
    }
    $("#conversation").hide();
    $("#interaction").hide();
    $("#chat").html("");
    fetch(serverAddress + '/users').then((response) => {
        $("#user").html("");
        response.json().then((users) => {
            showUsers(users);
        });
    });
}

function login() {
    var user = JSON.parse(window.localStorage.getItem('user'))
    if (user == null) {
         user = {};
         user.name = prompt('Username');
    }
    var socket = new SockJS('/whatsapp');
     stompClient = Stomp.over(socket);
     stompClient.connect({}, function (frame) {
     setConnected(true);
     console.log('Connected: ' + frame);
     stompClient.subscribe('/topic/users', function (user) {
         showUser(JSON.parse(user.body));
     });
     loginAndConnect(user);
    });
}

function loginAndConnect(user) {
    fetch(serverAddress + '/login', { method : 'POST',
                                           headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                           body : JSON.stringify({'name': user.name})})
        .then((response) => response.json())
        .then((user) => {
            window.localStorage.setItem('user', JSON.stringify(user));
            $("#username").html("Welocme "+ user.name);
            stompClient.subscribe('/topic/'+ JSON.parse(window.localStorage.getItem('user')).id + '/inbox', function (message) {
                var msg = JSON.parse(message.body);
                showMessage(msg, false);
                    fetch(serverAddress + '/ack', { method : 'POST',
                                                               headers: { 'Content-Type': 'application/json' },
                                                               body : JSON.stringify(msg)})
                            .then((response) => response.json());

            });
            stompClient.subscribe('/topic/'+ JSON.parse(window.localStorage.getItem('user')).id + '/ack', function (message) {
                var msg = JSON.parse(message.body);
                if(msg.status === "SENT") {
                    showMessage(JSON.parse(message.body), true);
                }
                showAck(msg);
            });
        });
}

function signup() {
    var user = JSON.parse(window.localStorage.getItem('user'))
    if (user == null) {
         user = {};
         user.name = prompt('Username');
    }
    var socket = new SockJS('/whatsapp');
     stompClient = Stomp.over(socket);
     stompClient.connect({}, function (frame) {
     setConnected(true);
     console.log('Connected: ' + frame);
     stompClient.subscribe('/topic/users', function (user) {
         showUser(JSON.parse(user.body));
     });
     signupAndConnect(user);
    });

}

function signupAndConnect(user) {
    fetch(serverAddress + '/signup', { method : 'POST',
                                            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                            body : JSON.stringify({'name': user.name})})
        .then((response) => response.json())
        .then((user) => {
            window.localStorage.setItem('user', JSON.stringify(user));
            $("#username").html("Welocme "+ user.name);
            stompClient.subscribe('/topic/'+ JSON.parse(window.localStorage.getItem('user')).id + '/inbox', function (message) {
                var msg = JSON.parse(message.body);
                showMessage(msg, false);
                    fetch(serverAddress + '/ack', { method : 'POST',
                                                               headers: { 'Content-Type': 'application/json' },
                                                               body : JSON.stringify(msg)})
                            .then((response) => response.json());

            });
            stompClient.subscribe('/topic/'+ JSON.parse(window.localStorage.getItem('user')).id + '/ack', function (message) {
                var msg = JSON.parse(message.body);
                if(msg.status === "SENT") {
                    showMessage(JSON.parse(message.body), true);
                }
                showAck(msg);
            });
        });

}

function logout() {
    window.localStorage.clear();
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function send() {
    if(window.localStorage.getItem('user') == null) {
        logout();
        return;
    }
    message = JSON.stringify({'message': $("#message").val(), 'from': JSON.parse(window.localStorage.getItem('user')).name, 'to': $("#to").val()});
    fetch(serverAddress + '/send', { method : 'POST',
                                               headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                                               body : message})
            .then((response) => response.json());
}

function showMessage(message, isSent) {
    if(isSent) {
        $("#chat").append("<tr><td></td><td></td><td><p id=" + message.id + ">" + message.message + " [" + message.status + "]" + "</p></td></tr>");
    } else {
        $('#'+message.from).click();
        $("#chat").append("<tr><td>" + message.message + "</td><td></td><td></td></tr>");
    }
}

function showAck(message) {
    $("#" + message.id).html( message.message + " [" + message.status + "]");
}



function showUsers(users) {
   users.forEach(user => showUser(user));
}

function showUser(user) {
   $("#user").append("<tr><td><button class=\"btn btn-default\" type=\"submit\" onClick=\"join(this)\" value=" + user.name + " id=" + user.name + ">"+ user.name +"</button></td></tr>");
}

function join(obj) {
    $("#to").val(obj.value);
    $("#chat-head").html(obj.value);
    $("#conversation").show();
    $("#interaction").show();
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#login" ).click(function() { login(); });
    $( "#logout" ).click(function() { logout(); });
    $( "#signup" ).click(function() { signup(); });
    $( "#send" ).click(function() { send(); });
    if(window.localStorage.getItem('user') != null) {
        login();
        return;
    }
    $("#login").show();
    $("#signup").show();
    $("#logout").hide();
    $("#conversation").hide();
    $("#interaction").hide();
});