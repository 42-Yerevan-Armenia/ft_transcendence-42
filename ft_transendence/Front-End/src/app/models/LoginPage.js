//login Page 
class LoginPage extends HtmlElement {
  // debugger
    constructor(){
      super(".LoginPage")
      // this._style.display = "none";
      this._style.display = "block";
    }
    _LoginPassword = document.querySelector(".LoginPageinputpassword")
    _LoginEmail = document.querySelector(".LoginPageinput");
    _LoginPageForgot = document.querySelector(".LoginPageForgot");
    _LoginPageContinue = document.querySelector(".LoginPageContinue");
    _ContinueWith42Intra = document.querySelector(".LoginPageContinueWith42");
    DisplayBlock() {
      this._style.display = "block";
    }

    //check valid email and password and set [Error Div].innerHtml answer
    ButtonSignIn() {
      const ErrorPassword = document.querySelector(".LoginPasswordError");
      const ErrorEmail = document.querySelector(".LoginEmailError");
  
  
  
      if (!this._LoginEmail?.value)
      {//if empty email
        ErrorEmail.style.color = "red";
        ErrorEmail.innerHTML = "Email must not be empty";
        return false;
      }
      else {
        const ContextValidation = ValidateEmail(this._LoginEmail.value);
  
        //email valid input
        if (ContextValidation[0] == 'V') {
          ErrorEmail.style.color = "blue";
          ErrorEmail.innerHTML = "";
        }
        else {
          //Email is not valid
          ErrorEmail.style.color = "red";
          ErrorEmail.innerHTML = ContextValidation;
          return false;
        }
      }
  
  
      if (!this._LoginPassword?.value) {
        ErrorPassword.style.color = "red";
        ErrorPassword.innerHTML = "Password must not be empty";
        return false;
      }
      if (!(this._LoginPassword.value.length >= 8 && this._LoginPassword.value.length <= 15)){
        ErrorPassword.style.color = "red";
        ErrorPassword.innerHTML = "Password must be between 8 and 15 characters";
        return false;
      }
      return true;
    }

    SignInWithEmail = (email = "") => {
      this.DisplayBlock();
  
      let LoginPageinput = document.querySelector(".LoginPageinput");
  
      if (email.length > 0)
      {
        LoginPageinput.value = email;
      }
    }
    Get42Connect = async () => {
      debugger
      window.location.href = `${INTRA_API_URL}/oauth/authorize?client_id=${INTRA_API_UID}&redirect_uri=${INTRA_REDIRECT_URI}&response_type=code`
      console.log("User.42")
    }

    Post42ConnectBackend = async () => {
      debugger
      console.log("url42schools == " + User.url42schools);
      const res = await FetchRequest("POST","api/v1/login", JSON.stringify({
        "code": User.url42schools
      }))

      if (res.state)
      {
        console.log("respons == " + JSON.stringify(res, undefined, 2));
        myStorages.setAccsessTocken(res.message?.data);
        User.setDataFromBeckendTackIntra42(res.message?.data)
      }
    }

    draw() {
      
    }
    
}
