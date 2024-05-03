var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

console.log("HostPort.slice(7) =" + HostPort.slice(7))
Join_Ws.onmessage = message => {
    // debugger;
    
    if (!message.data) {
        return;
    }
    let response = JSON.parse(message.data);
    console.log(JSON.stringify(response))
    // debugger;

    //update Join list items
    if (response.method === "join_list_room" && User._getAccess) {
        Home._MidleJoinList._game_rooms = response.game_rooms;
        const join_listButton = document.querySelector(".JoinList");
        if (join_listButton.style.display !== "none")
            ManageMidle.Manage("JoinList");
    }
    
    console.log("=========================   response.method == " + response.method)
    // update JoinList->invite list
    if (response.method === "start_game" && User._getAccess) {
        debugger
        debugger
        response.liveGames.forEach(element => {
            if (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id)
            {
                const mainOnHtml = document.getElementById("mainSectionUsually");
                mainOnHtml.style.display = "none";
                const gameOnHtml = document.createElement("div");
                gameOnHtml.setAttribute("id", "board")

                //call game function for start game
                pongGame(element.game_room.room_id);
                mainOnHtml.style.display = "block";
                gameOnHtml.style.display = "none";
            }
        });
    }
}
