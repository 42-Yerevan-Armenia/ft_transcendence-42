//Register Page
class RegisterPage extends HtmlElement {
    constructor(){
      super(".RegisterPage")
      this._style.display = "none";
    }
    _RegisterPageContinue = document.querySelector(".RegisterPageContinue");
    _ContinueWith42Intra = document.querySelector(".RegisterPageContinueWith42");
    RegisterPageDisplayNone(){
      this._style.display = "none";
    }
    
    DisplayBlock(){this._style.display = "block";}
  
    async RegistersWithEmail() {
        let err = document.querySelector(".RegisterErrorHandling");
        let _RegisterPageinput = document.querySelector(".RegisterPageinput");
        let value = _RegisterPageinput.value;
    
        const ContextValidation = ValidateEmail(value);
        //check your email address is correct
        if (ContextValidation[0] !== 'V') {
          err.style.color = "red";
          err.innerHTML = ContextValidation;
          return false;
        }
        else {
          const result  = await ControllerCheckEmail(value)
          if (result.state){
            err.style.color = "blue";
            err.innerHTML = ContextValidation;
            err.innerHTML = "";
            User._Email = _RegisterPageinput.value;
            _RegisterPageinput.value = ""
            return true;
        }
        err.style.color = "orange";
        err.innerHTML = result?.message | "Error";
        return false;
      }
    }
    Get42Connect = async () => {
      // ////debugger
      get42Conf.Get42Connect();
      // window.location.href = `${INTRA_API_URL}/oauth/authorize?client_id=${INTRA_API_UID}&redirect_uri=${INTRA_REDIRECT_URI}&response_type=code`
      //console.log("User.42")
    }
    draw(){}
  };