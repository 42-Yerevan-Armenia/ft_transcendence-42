class localGame extends HtmlElement {
    constructor(){
        super(".local_game_front_start")
    }
    playNow = document.querySelector("#PlayNowTableID");
    local_game_front = document.querySelector("#local_game_front_start");

    htmlDrow = `
         <div id="local_game_front">
             <canvas></canvas>
             <p>Left - W and S | Right - up and down arrow keys</p>
         </div>
     `;

    draw(){
        debugger
        this.local_game_front.innerHTML = this.htmlDrow;
        Pong.initialize();
    }
}
