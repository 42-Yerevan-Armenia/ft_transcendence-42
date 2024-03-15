//Reset Page
class ResetPageA extends HtmlElement {
  debugger
  constructor() {
    super(".ResetPage");
    this._style.display = "none";
  }
  _ConfirmReset = document.querySelector(".ResetPageContinue");
  _Email = document.querySelector(".ResetPageinput");                      //input Email
  _ErrorEmail = document.querySelector(".ResetPageEmailError");             //when email is not correct

  checkValidEmail() {
    this._ErrorEmail.innerHTML = "";
    this._ErrorEmail.style.color = "red";
    console.log("length" + this._Email.value.length);
    if (!this._Email || !this._Email.value)
    {
      this._ErrorEmail.innerHTML = "Email cannot be empty";
      return false;
    }
    const respons =  ValidateEmail(this._Email.value);
    if (!respons || respons[0] !== "V")
    {
      this._ErrorEmail.innerHTML = "Email is not correct";
      return false
    }
    User._Email = this._Email.value;
    console.log("this._Email.value;  " + this._Email.value)
    console.log("User._Email  " + User._Email)

    return true;
  }

  async ResetEmail() {
    this._ErrorEmail.innerHTML = "";
    this._ErrorEmail.style.color = "red";

    console.log("Request = " + this._Email.value)
  
    if (!this._Email || !this._Email.value)
    {
      this._ErrorEmail.innerHTML = "Email cannot be empty";
      return false;
    }

    const res = await FetchRequest("POST", "password_reset", {email:this._Email.value});
  
    if (!res.state)
    {
      this._ErrorEmail.innerHTML = "Email is not correct";
      return false
    }
    return true;
  }
  Drow(){
      
  }
}
  