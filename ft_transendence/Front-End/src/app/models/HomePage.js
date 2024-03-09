

// Home Page
class HomePage extends HtmlElement {
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
  
    NavMidleHome = ()=>{
      this._MiddleSettings._style.display = "none";
      this._MidleCub._style.display = "none";
      
      this._Midle._style.display = "flex";
    }
  
    NavMiddleSettings = ()=>{
      this._Midle._style.display = "none";
      this._MidleCub._style.display = "none";
  
      this._MiddleSettings._style.display = "flex";
    }
  
    NavMidleCub = () => {
      this._Midle._style.display = "none";
      this._MiddleSettings._style.display = "none";
      
      this._MidleCub._style.display = "flex";
    }
    Drow(){
      this._HomeLeft.Drow();
    }
  }
  