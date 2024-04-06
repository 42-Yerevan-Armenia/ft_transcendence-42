// Home Page
class HomePage extends HtmlElement {
  // debugger
    constructor(){
      super(".homeSection");
      this._style.display = "block";
    };
  
    _Midle = new MiddleSECTION();
    _MiddleSettings = new MiddleSettings();
    _MidleCub = new MidleCub();
    _MidleJoinList = new JoinList();
    _HomeLeft = new HomeLeft();
    _HomeRight = new HomeRight();
    _HomeMessage = new MessagePage(".Message");
    _HomeRight = new HomeRight();
    _HomeMidleProfile = new MidleProfile();

    _NAV = {
      _Home : new HtmlElement(".LEFTHOME"),
      _Profile : new HtmlElement(".PROFIL"),
      _JoinListGame : new HtmlElement(".GAME"),
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
    usersDro = async () => {
        if (await User.menegAccsess())
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

    async Drow() {
      ManageMidle.Manage("midle")
      // ManageMidle.Manage("JoinList");
      await this.usersDro();
  
      this._HomeLeft.Drow();      //left botton User section
    }
  }
  