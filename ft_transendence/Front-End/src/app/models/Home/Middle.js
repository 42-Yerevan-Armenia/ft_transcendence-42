//Middle Sections inside for Home Page
class MiddleSECTION extends HtmlElement {
    constructor(){
      super(".MIDLESECTION")
      this._style.display = "flex";
    }
    // <div class="item">
    //     <Image src="./public/User.png" width="60" height="60"
    //         alt="user" class="imag"></Image>
    //     <h6 class="itemName">User.png</h6>
    //     <p class="itemP">123456 points</p>
    // </div>

    async topPlayers(){

    }
    async draw()
    {
      await topPlayers();
    }
  }
  