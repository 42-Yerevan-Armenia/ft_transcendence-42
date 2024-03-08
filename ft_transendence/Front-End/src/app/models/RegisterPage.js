//Register Page
class RegisterPage extends HtmlElement {
    constructor(){
      super(".RegisterPage")
      this._style.display = "none";
    }
    _RegisterPageContinue = document.querySelector(".RegisterPageContinue");
    RegisterPageDisplayNone(){
      this._style.display = "none";
    }
    
    DisplayBlock(){
      this._style.display = "block";
    }
  
    async RegistersWithEmail() {
      debugger
      let err = document.querySelector(".RegisterErrorHandling");
      let _RegisterPageinput = document.querySelector(".RegisterPageinput");
      let value = _RegisterPageinput.value;
  
      const ContextValidation = ValidateEmail(value);
  
      //check your email address is correct
      if (ContextValidation[0] !== 'V') {
        console.log("Email must by correct");
        err.style.color = "red";
        err.innerHTML = ContextValidation;
        return false;
      }
      else {
        const result  = await ControllerCheckEmail(value)
        console.log(JSON.stringify(result, undefined, 2));
        if (result.state){
          console.log("Email is correct must be");
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
    Drow(){
      
    }
  };