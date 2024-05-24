"use strict"

var Join_Ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/joinlist/")

var isStartedUrish = false;

Join_Ws.onmessage = message => {
    if (!message.data)
        return;
    let response = JSON.parse(message.data);

    if (response.method === "join_list_room" && User._getAccess) {
        Home._MidleJoinList._game_rooms = response.game_rooms;
        const join_listButton = document.querySelector(".JoinList");
        if (join_listButton.style.display !== "none")
            ManageMidle.Manage("JoinList");
    }

    const mainOnHtml = document.getElementById("mainSectionUsually");
    const body = document.querySelector(".addBodyStile");

    if (response.method === "updateLiveGames" && User._getAccess) {

        response.liveGames.forEach(async element => {
            if (isStartedUrish === false && (User._Id == element.game_room.left_id || User._Id == element.game_room.right_id)) {

                mainOnHtml.style.display = "none";

                if (document.getElementById("board")){
                    body.innerHTML = null;
                }
                const gameOnHtml = document.createElement("div");
                gameOnHtml.setAttribute("id", "board")
                body.style.display = "block";
                body.appendChild(gameOnHtml)
                isStartedUrish = true;
                await pongGame(User, element.game_room.room_id);
            }
        });
    }
}
