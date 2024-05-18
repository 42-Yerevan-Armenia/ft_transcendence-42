// import {pongGamelol} from "./models/Home/game/game.js";

var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

console.log("HostPort.slice(7) =" + HostPort.slice(7))
Join_Ws.onmessage = message => {
    if (!message.data)
        return;
    let response = JSON.parse(message.data);
    // console.log(JSON.stringify(response))
    //update Join list items
    if (response.method === "join_list_room" && User._getAccess) {
        Home._MidleJoinList._game_rooms = response.game_rooms;
        const join_listButton = document.querySelector(".JoinList");
        if (join_listButton.style.display !== "none")
            ManageMidle.Manage("JoinList");
    }
    console.log("=========================   response.method == " + response.method)
    // update JoinList->invite list
    const mainOnHtml = document.getElementById("mainSectionUsually");
    const body = document.querySelector(".addBodyStile");
    // if (response.method === "start_game" && User._getAccess) {
    //     debugger
    //     debugger
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
        response.liveGames.forEach(async element => {
            if (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id) {
                //main displey none
                mainOnHtml.style.display = "none";
                //add game
                if (body.querySelector("#board") == null) {
                    const gameOnHtml = document.createElement("div");
                    gameOnHtml.setAttribute("id", "board")
                    body.style.display = "block";
                    body.appendChild(gameOnHtml)
                }
                //call game function for start game
                await pongGame(User, element.game_room.room_id);
            }
        });
    }
}
