//Home Page left section User
class HomeLeft extends HtmlElement {
    constructor(){
      super(".User")
      this._style.display = "none";
      this.Drow();
    }
    _LongOut  = document.querySelector(".IconExit");
    _Name = document.querySelector("#UserH5");
    _NickName = document.querySelector("#UserH6");
    _Image = document.querySelector("#UserImage");
    Drow() {
      if (User.checkSignIn())
      {
        this._Name.innerHTML = User._Name;
        this._NickName.innerHTML = User._NickName;
        this._Image.src = "/public/User.png";//User._Image;
        // User
      }
    }
}
