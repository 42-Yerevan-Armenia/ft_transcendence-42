class ConfirmPage extends HtmlElement {
    constructor() {
      super(".ConfirmPage")
      this._style.display = "none";
    }
    ConfirmYourEmail = document.querySelector('.ConfirmPageContinue');
    TimeDureation = document.querySelector(".ConfirmPageDureation");
    TimeDureationStart = "";
    err = document.querySelector(".ErrorConfirmPageCode");
    v0 = document.querySelector(".ConfirmPagepassword0");
    v1 = document.querySelector(".ConfirmPagepassword1");
    v2 = document.querySelector(".ConfirmPagepassword2");
    v3 = document.querySelector(".ConfirmPagepassword3");
    v4 = document.querySelector(".ConfirmPagepassword4");
  
   async TimeDureationPermission(){
      let current = new Date() * 0.0006 + "";
      current = current.substring(0, current.lastIndexOf("."));
      current = 30 - (current - this.TimeDureationStart);
      setTimeout(() => {
        if (User._ConfirmEmail)
          return true;
        if (current <= 0) {
          this._style.display = "none";
          User._ConfirmEmail = false;
          Home.DisplayBlock();
          this.ValuesAllEmpty();
          return false;
        }
        else {
          this.TimeDureationPermission()
          this.TimeDureation.innerHTML = current; //minuts
        }
      }, 1000);
    }
  
    async setDisplayBlock(){
      this.TimeDureation.innerHTML = "";
      this._style.display = "block";
      this.TimeDureationStart =  new Date() * 0.0006 + "";
      this.TimeDureationStart = this.TimeDureationStart.substring(0, this.TimeDureationStart.lastIndexOf("."));
      this.TimeDureationPermission();
    }
  
    ValuesAllEmpty()
    {
      this.v0.value="";
      this.v1.value="";
      this.v2.value="";
      this.v3.value="";
      this.v4.value="";
    }
    //when respons have error
    ErrorHandling(message){
      this.err.style.color = "";
      this.err.innerHTML = message;
      this.ValuesAllEmpty();
    }
    //click confirm button and check respons
    async ConfirmPageContinue(isReset) {
      this.err.innerHTML = "";
      this.v0.value += ""
      this.v1.value += ""
      this.v2.value += ""
      this.v3.value += ""
      this.v4.value += ""
      //each input must not be empty
      if (!this.v0.value || !this.v1.value || !this.v2.value || !this.v3.value || !this.v4.value) {
        this.err.style.color = "";
        this.err.innerHTML = "all items must be recorded";
      }
      else {
        if (this.v0.value.length !== 1 || this.v1.value.length !== 1 || this.v2.value.length !== 1
                || this.v3.value.length !== 1 || this.v4.value.length !== 1) {
          this.ErrorHandling("each element must be one number");
        }
        else {
          //the code must be a string for the request sent
          const code = this.v0.value + "" + this.v1.value + this.v2.value + this.v3.value + this.v4.value;
          let data ;
          if(isReset) {
            data =  await FetchRequest("POST", "forget_confirm", {code: code, email: User._Email});
            return data;
          }
          else
            data =  await ControllerCheckReplayCode(code);
          //Error message
          if (!data.state) {
            const message = data.message.substring(0, data.message.length - 3);
            this.ErrorHandling(message + "");
          }
          return data;
        }
      }
      return null;
    }
    draw(){this.setDisplayBlock(Home);}
  }
  