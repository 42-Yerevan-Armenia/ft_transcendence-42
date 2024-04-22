
// User.menegAccsess();
// const chatSocket = new WebSocket("ws://" + window.location.host + "/");
const chatSocket = new WebSocket("ws://" + HostPort.slice(7) + "/");

console.log("window.location.host  = " + window.location.host);

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


/* 
<div class="MessagPrivateSubjectMessagSender">
    <div class="MessagPrivateSubjectMessagSenderDivMessag">
        <p class="MessagPrivateSubjectMessagSenderMessag">
            I am great, Thanks!
        </p>
    </div>
    <p class="MessagPrivateSubjectMessagSenderDaye">
        9.23 AM
    <p>
</div>
 */


function sender(item){
    const div = document.createElement("div");
    div.setAttribute("class", "MessagPrivateSubjectMessagSender");

    const div1 = document.createElement("div");
    div1.setAttribute("class", "MessagPrivateSubjectMessagSenderDivMessag");

    const div1p = document.createElement("p");
    div1p.setAttribute("class", "MessagPrivateSubjectMessagSenderMessag");
    div1p.innerHTML = item.message;
    div1.appendChild(div1p);

    const p = document.createElement("p");
    p.setAttribute("class", "MessagPrivateSubjectMessagSenderDaye")
    p.innerHTML = item.username + " : " + item.time;

    div.appendChild(div1);
    div.appendChild(p);
    const divElement = document.querySelector("#containerScroll")
    divElement.appendChild(div);
}



/* 
<div class="MessagPrivateSubjectMessagPerson">
    1<div class="MessagPrivateSubjectMessagDivPerson">
        <p class="MessagPrivateSubjectMessagPersonChat">
            Hi there, How are you?
        </p>
    </div>
    <p>
        9.20 AM
    </p>
</div> 
*/

function person(item){
    const div = document.createElement("div");
    div.setAttribute("class", "MessagPrivateSubjectMessagPerson");

    const div1 = document.createElement("div");
    div1.setAttribute("class", "MessagPrivateSubjectMessagDivPerson");

    const div1p = document.createElement("p");
    div1p.setAttribute("class", "MessagPrivateSubjectMessagPersonChat");
    div1p.innerHTML = item.message;
    div1.appendChild(div1p);

    const p = document.createElement("p");
    p.innerHTML = item.username + " : " + item.time;

    div.appendChild(div1);
    div.appendChild(p);
    const divElement = document.querySelector("#containerScroll");
    divElement.appendChild(div);
}


chatSocket.onmessage = function (e) {

    const data = JSON.parse(e.data);
    var div = document.createElement("div");
    if (!data.message)
    {
        document.querySelector("#id_message_send_input").value = "";
        return
    }
    // if (data.message == )



console.log("+++++++++++++++++" +data)
console.log(data);

    // if (data.username === User._Nickname)
    // {
        Home._HomeMessage.draw({
            "send": "Privat",
            "message":data.message,
            "time": new Date().getTime(),
            "username" : "Kara",//data.username,
            "src" : "/public/avatar.png",
            "isOnlain": true
        })
    //     person({
    //         "message":data.message,
    //         "time": new Date().getTime(),
    //         "name" : data.username
    //     });
    // }
    // else{
    //     sender({
    //         "message":data.message,
    //         "time": new Date().getTime(),
    //         "name" : data.username
    //     });
    // }
    
    // div.innerHTML = data.username + " : " + data.message;



    document.querySelector("#id_message_send_input").value = "";

    // document.querySelector("#containerScroll").appendChild(div);
    scrollToLastTag();                                                  //for show new messag
};