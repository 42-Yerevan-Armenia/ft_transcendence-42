//parent class
let GameRoomNewClientID = "";
class HtmlElement {
  // //debugger
    constructor(name) {
      this._classname = document.querySelector(name);
      this._style = this._classname ? this._classname.style : null;
    }
    DisplayBlock()
    {
      this._style.display = "block";
    }
    DisplayNone()
    {
      this._style.display = "none";
    }
    _classname;
    _style;
  }
  