var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

console.log("HostPort.slice(7) =" + HostPort.slice(7))
Join_Ws.onmessage = message => {
    debugger;
    if (!message.data) {
        return;
    }
    let response = JSON.parse(message.data);
    console.log(JSON.stringify(response))
    debugger;

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
        const gameRoom = response.game_room;

        if (User._Id == gameRoom.left_id || User._Id == gameRoom.right_id)
        {
            pongGame(User, gameRoom.room_id);
        }
    }
}
