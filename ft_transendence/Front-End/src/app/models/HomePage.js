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
    _HomeRight = new HomeRight();
    _HomeMessage = new MessagePage(".Message");

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
    };
    usersDro = () => {
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
    ButtonSignIn = (email = "") => {
      if (email.length > 0)
      {
  
      }
      this._style.display = "none";
    }
    ButtonSignUp = () => {
      this._style.display = "none";
    }

    Drow() {
      ManageMidle.Manage("midle")
      this.usersDro();
  
      this._HomeLeft.Drow();      //left botton User section
    }
  }
  