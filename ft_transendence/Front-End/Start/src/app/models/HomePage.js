// Home Page
class HomePage extends HtmlElement {
    constructor(){
      super(".homeSection");
      this._style.display = "block";
      this._Midle = new MiddleSECTION();
      this._MiddleSettings = new MiddleSettings();
      this._MidleCub = new MidleCub();
      this._MidleCommunity = new MidleCommunity();
      this._MidleJoinList = new JoinList();
      this._HomeLeft = new HomeLeft();
      this._HomeRight = new HomeRight();
      this._HomeMessage = new MessagePage(".Message");
      this._HomeRight = new HomeRight();
      this._HomeMidleProfile = new MidleProfile();
      this._MidleHistoryGame = new MidleHistoryGame();
      this._AccountUser = new AccountUser();
    };
  
    _NAV = {
      _Home : new HtmlElement(".LEFTHOME"),
      _Profile : new HtmlElement(".PROFIL"),
      _JoinListGame : new HtmlElement(".GAME"),
      _LEADERBOARD : new HtmlElement(".LEADERBOARD"),
      _Community : new HtmlElement(".LIVE"),
      _SETTINGS : new HtmlElement(".SETTINGS"),
    };
    _NavSigninSignout = {
      _NavSignin : document.querySelector(".NavSignin"),
      _NavSignin1 :  document.querySelector(".RightsigninButton"),
      // _NavSignUp : document.querySelector(".NavSignUp"),
      // _NavSignUp1 : document.querySelector(".RightgninupButton"),
    };
    usersDro = async () => {
        if (await User.menegAccsess()) {
          document.querySelector("#homeNavigation").style.display  = "block";
          document.querySelector(".User").style.display  = "flex";
          ManageRight.Manage("Message");
        }
        else {
          document.querySelector("#homeNavigation").style.display  = "none";
          document.querySelector(".User").style.display  = "none";
          ManageRight.Manage("right");
        }
    }
    ButtonSignIn = (email = "") => {
      if (email.length > 0){} 
      this._style.display = "none";
    }
    ButtonSignUp = () => {
      this._style.display = "none";
    }

    async draw() {
      // ////debugger
      ManageMidle.Manage("midle")
      // ManageMidle.Manage("JoinList");
      await this.usersDro();
  
      this._HomeLeft.draw();      //left botton User section
    }
  }
  