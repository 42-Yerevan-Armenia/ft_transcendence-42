
console.log("narev");



let uuid = function(){
    return Array
    .from(Array(16))
    .map(e => Math.floor(Math.random() * 255)
    .toString(16)
    .padStart(2,"0"))
    .join('')
    .match(/.{1,4}/g)
    .join('-')
}

const user = {
    "id": uuid(),
}
function movePaddle(paddle, direction, max_paddle_y, paddle_step) {
    // Delayed execution after 2000 milliseconds (2 seconds)
    const paddleY = parseInt(paddle.style.top, 10);
    const paddleHeight = parseInt(paddle.style.height, 10);
    if (direction == "down" && paddleY + paddleHeight < max_paddle_y) {
        paddle.style.top = (paddleY + paddle_step) + "px";
    } else if  (direction == "up" && paddleY > 0) {
        paddle.style.top = (paddleY - paddle_step) + "px";
    }
}

async function pongGame(objUser ,gameid) {
    let isStarted = false;
    function isOpen(ws) { return ws.readyState === ws.OPEN }

    //HTML elements
    let clientId = objUser._Id;
    let paddleName = null;
    const constants = {
        "paddle_step": null,
        "screen_width": null,
        "screen_height": null
    }
    // let paddle_step = null;
    // let screen_width = null;
    // let screen_height = null;

    if (!clientId)
        clientId = uuid();
    let gameId = gameid;
    let playerColor = null;
    // let ws = new WebSocket("ws://" + window.location.host + "/ws/game/" + gameId)
    let ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/game/" + gameId)
    const payLoad = {
        "method": "connect",
        "clientId": clientId,
        "gameId": gameId
    }

    ws.onopen = () => ws.send(JSON.stringify(payLoad));
    console.log("ws://" + window.location.host + "/ws/game/");
    console.log("ws = ", window.location.host);

    // const txtGameId = document.getElementById("txtGameId");
    // const divPlayers = document.getElementById("divPlayers");
    debugger
    const board = document.getElementById("board");


    //wiring events
    document.addEventListener("keydown", event => {
        // console.log(event);
        // if (gameId === null)
        //     return ;
        const payLoad = {
            "method": "updateKey",
            "clientId": clientId,
            "gameId": gameId
        }
        console.log("paddleName = ", paddleName);
        if (event.key === "ArrowUp") {
            payLoad["direction"] = "up";
            const paddle = document.getElementById(paddleName); // paddle2
            // setTimeout(delayedFunction, 2000);
            setTimeout(function() {
                movePaddle(paddle , "up", board.offsetHeight, constants.paddle_step);
            }, 100);
            // movePaddle(paddle , "up", board.offsetHeight, constants.paddle_step);
        } else if (event.key === "ArrowDown") {
            payLoad["direction"] = "down";
            const paddle = document.getElementById(paddleName); // paddle1
            setTimeout(function() {
                movePaddle(paddle, "down", board.offsetHeight, constants.paddle_step);
            }, 100);
            // movePaddle(paddle, "down", board.offsetHeight, constants.paddle_step);
        } else {
            return;
        }
        ws.send(JSON.stringify(payLoad));
    });
/*
    btnJoin.addEventListener("click", e => {
        // const obj = {
        //     "key": [1, 2, 5, 5],
        //     "objs": [{"red": 5}, {"blue": 6}]
        // };
        if (gameId === null)
            gameId = txtGameId.value;
        const payLoad = {
            "method": "join",
            "clientId": clientId,
            "gameId": gameId
        }
        if (ws.readyState === WebSocket.CLOSED) {
            console.log("socket closed");
        } 
        // console.log("ws.readyState = ", ws.readyState);
        ws.send(JSON.stringify(payLoad));

    })

    btnStart.addEventListener("click", e => {

        const payLoad = {
            "method": "start",
            "clientId": clientId,
            "gameId": gameId
        }
        ws.send(JSON.stringify(payLoad));

    })

    btnCreate.addEventListener("click", e => {

        const payLoad = {
            "method": "create",
            "clientId": clientId,
        }
        ws.send(JSON.stringify(payLoad));
    })
*/
    ws.onmessage = message => {
        //message.data
        let response;
        if (message) {
            try {
                response = JSON.parse(message.data);
            } catch (e) {
                // debugger;
                console.log("e = ", e);
                return console.error(e);
            }
        }
        console.log("++++++++++++++++++++++++++"+message);
        const mainOnHtml = document.getElementById("mainSectionUsually");
        const body = document.querySelector(".addBodyStile");
    debugger
        if (response?.method === "finish_match" && User?._getAccess)
        {
                if (User._Id == response.state.game_room.left_id || User._Id == response.state.game_room.right_id)
                {
                    // update when game terminate
                    mainOnHtml.style.display = "block";
                    body.style.display = "none";
                    return
                }
        }
        // console.log(response);
        if (response.method === "connect"){
            console.log("response = ", response);
            paddleName = response.state[clientId];
            // clientId = response.clientId;
            constants.paddle_step = response.constants.paddle_step;
            constants.screen_width = response.constants.screen_width;
            constants.screen_height = response.constants.screen_height;
            console.log("Client id Set successfully " + clientId)
        }

        //create
        if (response.method === "create"){
            console.log("response = ", response);
            gameId = response.game["id"];
            console.log("game successfully created with id " + response.game.id + " with " + response.game.balls + " balls")  
        }


        //update
        if (response.method === "update"){
            if (isStarted === false) {
                isStarted = true;
                const a = document.createElement("div");
                // console.log("response.game = " ,response.game);
                const paddle1 = response.state.paddle1;
                a.id = "paddle1";
                a.className = "paddle";
                a.style.width = paddle1.width + "px";
                a.style.height = paddle1.height + "px";
                a.style.left = paddle1.x + "px";
                a.style.top = paddle1.y + "px";
                board.appendChild(a);
        
                const b = document.createElement("div");
                const paddle2 = response.state.paddle2;
                b.id = "paddle2";
                b.className = "paddle";
                b.style.width = paddle2.width + "px";
                b.style.height = paddle2.height + "px";
                b.style.left = paddle2.x + "px";
                b.style.top = paddle2.y + "px";
                board.appendChild(b);
                const c = document.createElement("div");
                const ballRadius = response.state.ball.radius;
                c.className = "ball";
                c.id = "ball";
                c.style.width = ballRadius * 2 + "px";
                c.style.height = ballRadius * 2 + "px";
                c.style.borderRadius = "30px";

                c.style.left = response?.state?.ball?.x - ballRadius + "px";
                c.style.top = response.state.ball.y - ballRadius + "px";
                board.appendChild(c);
        
                const score1 = document.createElement("span");
                score1.className = "score";
                score1.id = "score1";
                score1.appendChild(document.createTextNode("0"));
                const score2 = document.createElement("span");
                score2.className = "score";
                score2.id = "score2";
                score2.appendChild(document.createTextNode("0"));
                board.appendChild(score1);
                board.appendChild(score2);
            }
            if (!response.state) return;
            const ballObject = document.getElementById("ball");
            // ballRadius = response.state.ballRadius;
            if (!response?.state?.ball?.x || !response?.state?.ball?.y)
                return

            ballObject.style.left = response?.state?.ball?.x + "px";
            ballObject.style.top = response?.state?.ball?.y + "px";
            if (paddleName === "paddle1") {
                const paddle2 = document.getElementById("paddle2");
                
                paddle2.style.left = response.state.paddle2.x + "px";
                paddle2.style.top = response.state.paddle2.y + "px";
            } else {
                const paddle1 = document.getElementById("paddle1");
    
                paddle1.style.left = response.state.paddle1.x + "px";
                paddle1.style.top = response.state.paddle1.y + "px";
            }

            const score1 = document.getElementById("score1");
            const score2 = document.getElementById("score2");
            score1.textContent = response.state.paddle1.score;
            score2.textContent = response.state.paddle2.score;
            // for(const b of Object.keys(response.state))
            // {
            //     const objToDraw = response.state[b];
            //     // context.fillRect(objToDraw._x, objToDraw._y, objToDraw._radius * 2, objToDraw._radius * 2);
            //     const ballObject = document.getElementById(b);
            //     if (ballObject === null) {
            //         console.log("ballObject = ", ballObject);
            //         console.log("b = ", b);
            //     } else {
            //         let ballRadius = 0;
            //         if (b === "ball") {
            //             ballRadius = response.state.ballRadius;
            //         } else {
            //             ballObject.textContent = response.state["paddle1"];
            //         }
            //         ballObject.style.left = objToDraw.x + "px";
            //         ballObject.style.top = objToDraw.y + "px";
            //     }
            // }
        }

        //join
        if (response.method === "join"){
            const game = response.game;
            console.log(game);
            console.log("joined")
            // context.clearRect(0, 0, canvas.width, canvas.height);
            // context.fillRect(objToDraw.x, objToDraw.y, objToDraw.width, objToDraw.height);
            // context.fillRect(10, 100, 10, 10);
            // TODO change board with and heght

            const a = document.createElement("div");
            // console.log("response.game = " ,response.game);
            a.id = "paddle1";
            a.className = "paddle";
            a.style.width = "20px";
            a.style.height = "100px";
            a.style.left = response.game.state.paddle1.x + "px";
            a.style.top = response.game.state.paddle1.y + "px";
            board.appendChild(a);

            const b = document.createElement("div");
            
            b.id = "paddle2";
            b.className = "paddle";
            b.style.width = "20px";
            b.style.height = "100px";
            b.style.left = response.game.state.paddle2.x + "px";
            b.style.top = response.game.state.paddle2.y + "px";
            board.appendChild(b);

            const c = document.createElement("div");
            const ballRadius = response.game.state.ball.ballRadius;
            c.className = "ball";
            c.id = "ball";
            c.style.width = ballRadius * 2 + "px";
            c.style.height = ballRadius * 2 + "px";
            c.style.borderRadius = "30px";
            c.style.left = response.game.state.ball.x - ballRadius + "px";
            c.style.top = response.game.state.ball.y - ballRadius + "px";
            board.appendChild(c);

            const score1 = document.createElement("span");
            score1.className = "score";
            score1.id = "score1";
            score1.appendChild(document.createTextNode("0"));
            const score2 = document.createElement("span");
            score2.className = "score";
            score2.id = "score2";
            score2.appendChild(document.createTextNode("0"));
            board.appendChild(score1);
            board.appendChild(score2);
            


            // d.textContent = c.clientId;
            // game.clients.forEach (c => {

            //     const d = document.createElement("div");
            //     d.style.width = "200px";
            //     d.style.background = c.color
            //     d.textContent = c.clientId;
            //     divPlayers.appendChild(d);

            //     if (c.clientId === clientId) playerColor = c.color;
            // })


            // while(board.firstChild)
            // board.removeChild (board.firstChild)

            // for (let i = 0; i < game.balls; i++){

            //     const b = document.createElement("button");
            //     b.id = "ball" + (i +1);
            //     b.tag = i+1
            //     b.textContent = i+1
            //     b.style.width = "150px"
            //     b.style.height = "150px"
            //     b.addEventListener("click", e => {
            //         b.style.background = playerColor
            //         const payLoad = {
            //             "method": "play",
            //             "clientId": clientId,
            //             "gameId": gameId,
            //             "ballId": b.tag,
            //             "color": playerColor
            //         }
            //         ws.send(JSON.stringify(payLoad))
            //     })
            //     board.appendChild(b);
            // }
        }
        // if (response.method === "start") {
        //     //{1: "red", 1}
        //     // if (!response.game.state) return;
        //     // for(const b of Object.keys(response.game.state))
        //     // {
        //     //     const color = response.game.state[b];
        //     //     const ballObject = document.getElementById("ball" + b);
        //     //     ballObject.style.backgroundColor = color
        //     // }
        // }
    }

}


// pongGame(user);