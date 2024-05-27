class localGame extends HtmlElement {
    constructor(){
        super(".local_game")
    }
    playNow = document.querySelector("#PlayNowTableID");
    local_game_front = document.querySelector("#local_game");

    htmlDrow = `
         <div id="local_game_front">
             <canvas></canvas>
         </div>
     `;

    draw(){
        // debugger
        this.local_game_front.innerHTML = this.htmlDrow;
        Pong.initialize();
    }
}
