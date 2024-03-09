//Middle Sections inside for Home Page
class MiddleSECTION extends HtmlElement {
    constructor(){
      super(".MIDLESECTION")
      this._style.display = "flex";
    }
    func(){
      document.querySelector("#homeNavigation").style.display  = "block";
      document.querySelector(".User").style.display  = "flex";
    }
  }
  