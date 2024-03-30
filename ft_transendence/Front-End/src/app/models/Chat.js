
// User.menegAccsess();
// const chatSocket = new WebSocket("ws://" + window.location.host + "/");
const chatSocket = new WebSocket("ws://" + HostPort.slice(7) + "/");

console.log("window.location.host  = " + window.location.host);
console.log(window.location.host);
console.log("["+ HostPort.slice(7) + "]");

//Whene opened socket
chatSocket.onopen = function (e) {
    console.log("The connection was setup successfully !");
};

//When Have Error
chatSocket.onclose = function (e) {
    console.log("Something unexpected happened !");
};




document.querySelector("#id_message_send_input").focus();

//enter pres
document.querySelector("#id_message_send_input").onkeyup = function (e) {
if (e.keyCode == 13) {
    var messageInput = document.querySelector(
        "#id_message_send_input"
        ).value;
        chatSocket.send(JSON.stringify({ message: messageInput, username : User._Name}));
    }
};

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    var div = document.createElement("div");

    console.log(data + "---------- " )
    console.log(data);
    div.innerHTML = data.username + " : " + data.message;



    document.querySelector("#id_message_send_input").value = "";

    document.querySelector("#containerScroll").appendChild(div);
    scrollToLastTag();
};