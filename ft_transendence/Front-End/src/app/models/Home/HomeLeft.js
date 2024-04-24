//Home Page left botton section User
class HomeLeft extends HtmlElement {
    constructor(){
      super(".User")
      this._style.display = "none";
      this.draw();
    }
    _NavSigninNavSignUp = document.querySelector("#NavSigninNavSignUp");
    _NAVSIGNINSIGNOUTNavLoginOut = document.querySelector("#NAVSIGNINSIGNOUTNavLoginOut");
    _LongOut  = document.querySelector(".IconExit");
    _Name = document.querySelector("#UserH5");
    _Nickname = document.querySelector("#UserH6");
    _Image = document.querySelector("#UserImage");
    _ExploreMessag = document.querySelector(".Explore");
    _NavLoginOut = document.querySelector("#NavLoginOut");
    draw() {
      if (User.checkSignIn())
      {
        this._Name.innerHTML = User._Name;
        this._Nickname.innerHTML = User._Nickname;
        // Get the Base64-encoded string
        this._Image.src = `data:image/png;base64,${User._Image}`;
                      
        this._NavSigninNavSignUp.style.display = "none";
        this._NAVSIGNINSIGNOUTNavLoginOut.style.display = "flex";
      }
      else{
        this._NavSigninNavSignUp.style.display = "flex";
        this._NAVSIGNINSIGNOUTNavLoginOut.style.display = "none";
      }
    }
}

