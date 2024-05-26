// "use strict"

// var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

// var isStartedUrish = false;

// Join_Ws.onmessage = message => {
//     if (!message.data)
//         return;
//     let response = JSON.parse(message.data);

//     if (response.method === "join_list_room" && User._getAccess) {
//         Home._MidleJoinList._game_rooms = response.game_rooms;
//         const join_listButton = document.querySelector(".JoinList");
//         if (join_listButton.style.display !== "none")
//             ManageMidle.Manage("JoinList");
//     }

//     const mainOnHtml = document.getElementById("mainSectionUsually");
//     const body = document.querySelector(".addBodyStile");

//     if (response.method === "updateLiveGames" && User._getAccess) {

//         response.liveGames.forEach(async element => {
//             if (isStartedUrish === false && (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id)) {

//                 mainOnHtml.style.display = "none";

//                 if (document.getElementById("board")){
//                     body.innerHTML = null;
//                 }
//                 const gameOnHtml = document.createElement("div");
//                 gameOnHtml.setAttribute("id", "board")
//                 body.style.display = "block";
//                 body.appendChild(gameOnHtml)
//                 isStartedUrish = true;
//                 await pongGame(User, element.game_room.room_id);
//             }
//         });
//     }
// }



// // import {pongGamelol} from "./models/Home/game/game.js";

// var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

// console.log("HostPort.slice(7) =" + HostPort.slice(7))
// Join_Ws.onmessage = message => {
//     if (!message.data)
//         return;
//     let response = JSON.parse(message.data);
//     // console.log(JSON.stringify(response))
//     console.log("=========================   response.method == " + response.method)
    
    
//     //Rerender JoinList when user presdown button join  or leave
//     if (response.method === "join_list_room" && User._getAccess) {
//         Home._MidleJoinList._game_rooms = response.game_rooms;
//         const join_listButton = document.querySelector(".JoinList");
//         if (join_listButton.style.display !== "none")
//         ManageMidle.Manage("JoinList");
// }
// // update JoinList->invite list
//     const mainOnHtml = document.getElementById("mainSectionUsually");
//     const body = document.querySelector(".addBodyStile");
//     if (response.method === "start_game" && User._getAccess) {
// debugger
// debugger
//         response.game_rooms.forEach(async element => {
//             if (User._Id == element.creator_id || User._Id == element.current_players)
//             {
//                 //main displey none
//                 mainOnHtml.style.display = "none";
//                 //add game
//                 const gameOnHtml = document.createElement("div");
//                 gameOnHtml.setAttribute("id", "board")
//                 body.style.display = "block";
//                 body.appendChild(gameOnHtml)
//                 //call game function for start game
//                 await pongGame(User, element.id);
//             }
//         });
//     }




//     // if (response.method === "updateLiveGames" && User._getAccess) {
//     // debugger;
//     //     response.liveGames.forEach(async element => {
//     //         if (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id) {
//     //             //main displey none
//     //             mainOnHtml.style.display = "none";
//     //             //add game
//     //             if (body.querySelector("#board") == null) {
//     //                 const gameOnHtml = document.createElement("div");
//     //                 gameOnHtml.setAttribute("id", "board")
//     //                 body.style.display = "block";
//     //                 body.appendChild(gameOnHtml)
//     //             } else {
//     //                 // update when game terminate
//     //                 // mainOnHtml.style.display = "block";
//     //                 // body.style.display = "none";
//     //             }
//     //             //call game function for start game
//     //             await pongGame(User, element.game_room.room_id);
//     //         }
//     //     });
//     // }
// }
// import {pongGamelol} from "./models/Home/game/game.js";
























var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

var isStartedUrish = false;

Join_Ws.onopen = () => {
    console.log("Join_Ws.onopen");
    setTimeout(Join_Ws.send(JSON.stringify({
        "method": "get"
    })), 10000);
}

console.log("HostPort.slice(7) =" + HostPort.slice(7))
Join_Ws.onmessage = message => {
    console.log("Join_Ws.onmessage");
    if (!message.data)
    return;
let response = JSON.parse(message.data);
debugger;
console.log("response.method = ", response.method);
    // console.log(JSON.stringify(response))
    //update Join list items
    if ((response.method === "join_list_room" || response.method === "get") && User._getAccess) {
        Home._MidleJoinList._game_rooms = response.game_rooms;
        const join_listButton = document.querySelector(".JoinList");
        if (join_listButton.style.display !== "none")
            ManageMidle.Manage("JoinList");
    }
    console.log("=========================   response.method == " + response.method)
    // update JoinList->invite list
    
    // if (response.method === "start_game" && User._getAccess) {
    // debugger
    // debugger
    //     response.liveGames.forEach(async element => {
    //         if (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id)
    //         {
    //             //main displey none
    //             mainOnHtml.style.display = "none";
    //             //add game
    //             const gameOnHtml = document.createElement("div");
    //             gameOnHtml.setAttribute("id", "board")
    //             body.style.display = "block";
    //             body.appendChild(gameOnHtml)
    //             //call game function for start game
    //             await pongGame(User, element.game_room.room_id);
    //         }
    //     });
    // }
    if (response.method === "updateLiveGames" && User._getAccess) {
        console.log("response = ", response);
        console.log("User._Id = ", User._Id);
        console.log("isStartedUrish = ", isStartedUrish);
        response.liveGames.forEach(async element => {
            if (isStartedUrish === false && (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id)) {
                //main displey none
                const mainOnHtml = document.getElementById("mainSectionUsually");
                const body = document.querySelector(".addBodyStile");

                mainOnHtml.style.display = "none";
//add game
                if (document.getElementById("board")){
                    body.innerHTML = null;
                }
                const gameOnHtml = document.createElement("div");
                gameOnHtml.setAttribute("id", "board")
                body.style.display = "block";
                body.appendChild(gameOnHtml)
    // }
                //call game function for start game
                isStartedUrish = true;
                pongGame(User, element.game_room.room_id, "connect");
            }
        });
    }
}