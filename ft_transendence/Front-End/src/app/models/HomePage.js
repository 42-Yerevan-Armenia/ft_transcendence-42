

// Home Page
class HomePage extends HtmlElement {
  debugger
    constructor(){
      super(".homeSection");
      this._style.display = "block";
    };
  
    _Midle = new MiddleSECTION();
    _MiddleSettings = new MiddleSettings();
    _MidleCub = new MidleCub();
    _HomeLeft = new HomeLeft();

    _NAV = {
      _Home : new HtmlElement(".LEFTHOME"),
      _Profile : new HtmlElement(".PROFIL"),
      _GAME : new HtmlElement(".GAME"),
      _LEADERBOARD : new HtmlElement(".LEADERBOARD"),
      _LIVE : new HtmlElement(".LIVE"),
      _SETTINGS : new HtmlElement(".SETTINGS"),
    };
    _NavSigninSignout = {
      _NavSignin : document.querySelector(".NavSignin"),
      _NavSignin1 :  document.querySelector(".RightsigninButton"),
  
      _NavSignUp : document.querySelector(".NavSignUp"),
      _NavSignUp1 : document.querySelector(".RightgninupButton"),
    }
    ButtonSignIn = (email = "") => {
      if (email.length > 0)
      {
  
      }
      this._style.display = "none";
    }
    ButtonSignUp = () => {
      this._style.display = "none";
    }

    Drow(){
      ManageMidle.Manage("midle")
      
      this._HomeLeft.Drow();
    }
  }
  