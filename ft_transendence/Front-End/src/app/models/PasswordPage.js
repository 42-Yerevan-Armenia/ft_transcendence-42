class PasswordPage extends HtmlElement {
    constructor(){
      super(".PasswordPage")
      this._style.display = "none";
    }
    PasswordConfirm = document.querySelector(".PasswordPageContinue");
    _NewPassword = document.querySelector(".NewPassword");
    _RepeatPassword = document.querySelector(".RepeatPassword");
  
    errorSetNull(){
      document.querySelector(".LoginEmailError").innerHTML = ""
      document.querySelector(".LoginPasswordError").innerHTML = ""
    }
    notFined(){
      document.querySelector(".LoginEmailError").style.color = "red"
      document.querySelector(".LoginPasswordError").style.color = "red"
      document.querySelector(".LoginEmailError").innerHTML = "Error login or password is not correct"
      document.querySelector(".LoginPasswordError").innerHTML = "Error login or password is not correct"
    }
    PasswordConfirmButton(){
      User._Password = "";
      const NewPasswordError = document.querySelector(".NewPasswordError");
      const RepeatPasswordError = document.querySelector(".RepeatPasswordError")
      NewPasswordError.innerHTML = "";
      RepeatPasswordError.innerHTML = "";
      if (!this._NewPassword.value) {
        NewPasswordError.innerHTML = "must not be Empty";
        NewPasswordError.style.color = "red";
        return false;
      }
      if (!PasswordisCorrect(this._NewPassword, NewPasswordError))
        return false;
      if (!this._RepeatPassword.value) {
        RepeatPasswordError.innerHTML = "must not be Empty";
        RepeatPasswordError.style.color = "red";
        return false;
      }
      if (!PasswordisCorrect(this._RepeatPassword, RepeatPasswordError))
        return false;
      if (this._RepeatPassword.value !== this._NewPassword.value) {
        RepeatPasswordError.innerHTML = "replay password must be equal to password";
        RepeatPasswordError.style.color = "red";
        return false;
      }
      User._Password = this._RepeatPassword.value;
      return true;
    }
  
    async PasswordConfirmWithServer() {
      let Hash_code = HashCodeGeneration();
      return await ControllerPessPassword(Hash_code + "" + User._Password + "" + Hash_code, User);
    }

    draw(){this.errorSetNull();}
  }
  
  