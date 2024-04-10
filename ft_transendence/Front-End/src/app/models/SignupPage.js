//Signup Page
class SignupPage extends HtmlElement {
  //debugger
    constructor(){
      super(".SignupPage")
      this._style.display = "none";
    }
    SignupPageContinue = document.querySelector(".SignupPageContinue");
    _NewPassword = document.querySelector(".SignupNewPassword");
    _RepeatPassword = document.querySelector(".SignupRepeatPassword");
  
    checkNameNickname(){
      const nickname = document.querySelector(".SignupPageinputNickName");
      const name = document.querySelector(".SignupPageinputName");
      const nickError = document.querySelector(".SignupPageinputDivErrorNickname");
      const nameError = document.querySelector(".SignupPageinputDivErrorName");
      nickError.innerHTML = "";
      nameError.innerHTML = "";
  
      if (!name.value || name.value.length < 2 || name.value.length > 30 || !checkName(name.value))
      {
        User._Name = "";
        nameError.innerHTML = "The name must consist of uppercase characters first and then lowercase characters and range from 5 to 15.";
        return false;
      }
      if (!nickname.value || nickname.value.length < 2 || nickname.value.length > 30)
      {
        User._Nickname;
        nickError.innerHTML = "The name must contain at least 2 characters and no more than 30.";
        return false;
      }
      User._Name = name.value;
      User._Nickname = name.value;
      return true;
    }
  
    PasswordConfirmButton(){
      const NewPasswordError = document.querySelector(".SignupPageinputDivError");
      const RepeatPasswordError = document.querySelector(".SignupPageinputDivErrorReplay")
      NewPasswordError.innerHTML = "";
      RepeatPasswordError.innerHTML = "";
      if (!this._NewPassword.value)
      {
        User._Password = "";
        NewPasswordError.innerHTML = "must not be Empty";
        NewPasswordError.style.color = "red";
        return false;
      }
      if (!PasswordisCorrect(this._NewPassword, NewPasswordError))
      {
        User._Password = "";
        return false;
      }
      if (!this._RepeatPassword.value)
      {
        User._Password = "";
        RepeatPasswordError.innerHTML = "must not be Empty";
        RepeatPasswordError.style.color = "red";
        return false;
      }
      if (!PasswordisCorrect(this._RepeatPassword, RepeatPasswordError))
      {
        User._Password = "";
        return false;
      }
      if (this._RepeatPassword.value !== this._NewPassword.value)
      {
        User._Password = "";
        RepeatPasswordError.innerHTML = "replay password must be equal to password";
        RepeatPasswordError.style.color = "red";
        return false;
      }
      User._Password = this._RepeatPassword.value;
      return true;
    }
  
    async PasswordConfirmWithServer() {
      let Hash_code = HashCodeGeneration();
      //debugger
      return await ControllerSignUp(Hash_code + "" + User._Password + "" + Hash_code, User);
    }
    
    draw(){
      
    }
  }
  