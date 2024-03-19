//Home Page left botton section User
class HomeLeft extends HtmlElement {
    constructor(){
      super(".User")
      this._style.display = "none";
      this.Drow();
    }
    _LongOut  = document.querySelector(".IconExit");
    _Name = document.querySelector("#UserH5");
    _Nickname = document.querySelector("#UserH6");
    _Image = document.querySelector("#UserImage");


    
    Drow() {
      debugger
      console.warn("++++++++++++++++++1")
      if (User.checkSignIn())
      {
        console.warn("++++++++++++++++++2")
        this._Name.innerHTML = User._Name;
        this._Nickname.innerHTML = User._Nickname;
        // Get the Base64-encoded string
        this._Image.src = `data:image/png;base64,${User._Image}`;
      }
    }
}
