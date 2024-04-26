const Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")


Join_Ws.onmessage = message => {
    debugger;
    if (!message.data) {
        return;
    }
    let response = JSON.parse(message.data);
    console.log(JSON.stringify(response))
    debugger;

    //update Join list items
    if (response.method === "update_room" && User._getAccess) {
        Home._MidleJoinList._game_rooms = response.game_rooms;
        const join_listButton = document.querySelector(".JoinList");
        if (join_listButton.style.display !== "none")
            ManageMidle.Manage("JoinList");
    }

    //
}
