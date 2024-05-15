import {PongGame} from "./pongGame.js";

var gameInstance = new PongGame();

async function pongGamelol(objUser ,gameid) {
    if (isStarted)
        return;
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

//++++++++++++++++++++++++++++++++++++++++++++++++++++++

let ws = new WebSocket("ws://" + HostPort.slice(7) + "/ws/game/" + gameId)

//++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
    // debugger
    const board = document.getElementById("board");

    clearBox("board");
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
        }
        else if (event.key === "ArrowDown") {
            payLoad["direction"] = "down";
            const paddle = document.getElementById(paddleName); // paddle1
            setTimeout(function() {
                movePaddle(paddle, "down", board.offsetHeight, constants.paddle_step);
            }, 100);
            // movePaddle(paddle, "down", board.offsetHeight, constants.paddle_step);
        }
        else
            return;
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(payLoad));
        }
    });

    function clearBox(elementID) {
        document.getElementById(elementID).innerHTML = "";
    }

    ws.onmessage = message => {
        //message.data
        console.log("✅ message = ", message);
        let response;
        if (message) {
            try {
                response = JSON.parse(message.data);
            }
            catch (e) {
                console.log("e = ", e);
                return console.error(e);
            }
        }
        const mainOnHtml = document.getElementById("mainSectionUsually");
        const body = document.querySelector(".addBodyStile");
        if (response?.method === "finish_match" && User?._getAccess) {
            if (User._Id == response.state.game_room.left_id || User._Id == response.state.game_room.right_id) {
                ws.close();
                clearBox("board");
                // update when game terminate
                mainOnHtml.style.display = "block";
                body.style.display = "none";
                return
            }
        }
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
            if (!response.state)
                return;
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
            }
            else {
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
            // TODO change board with and heght
            const a = document.createElement("div");
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
        }
    }
}

export {pongGamelol};