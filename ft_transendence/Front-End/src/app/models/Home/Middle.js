//Middle Sections inside for Home Page
class MiddleSECTION extends HtmlElement {
    constructor(){
      super(".MIDLESECTION")
      this._style.display = "flex";
    }
    Drow()
    {
      if (User.menegAccsess())
      {
        document.querySelector("#homeNavigation").style.display  = "block";
        document.querySelector(".User").style.display  = "flex";
        ManageRight.Manage("Message");
      }
      else
      {
        document.querySelector("#homeNavigation").style.display  = "none";
        document.querySelector(".User").style.display  = "none";
        ManageRight.Manage("right");
      }
    }
  }
  