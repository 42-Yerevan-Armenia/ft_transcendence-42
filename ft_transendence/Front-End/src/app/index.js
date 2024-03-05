function ValidateEmail(input) {

  console.log("1input =[" + input  + "]");
  if (!input)
  {
    return "Invalid email address!";
  }
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input?.match(validRegex)) {
    return "Valid email address!";
  } else {
    return "Invalid email address!";
  }
}

function checkName(str) {
  // Regular expression to match strings with only characters
  // and starting with an uppercase letter
  const regex = /^[A-Z][a-z]*$/;

  // Test the string against the regular expression
  return regex.test(str);
}

function PasswordisCorrect(obj, error){
  if (obj.value.length < 8 || obj.value.length > 16)
  {
    error.innerHTML = "password must be 8 to 16 character";
    error.style.color = "red";
    return false;
  }
    // Define a regular expression to match the password criteria
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    
    // Test if the password matches the regular expression
  if (!passwordRegex.test(obj.value))
  {
    debugger
    error.innerHTML = "At least one lowercase letter , one uppercase letter, At least one digit";
    error.style.color = "red";
    return false;
  }
  return true;
}


function HashCodeGeneration(){
  let hashCode = Array.from({length:10}, (i) =>Math.floor(Math.random() * 10)) + "";
  const sliceDelete = /,/g;
  const str = hashCode.replace(sliceDelete, '');
  return str;
}


//-------------------------------------------------       Pages     ----------------------------------------

//user
class USER {
  constructor() {
  }
  _name = "";
  _nickname = "";
  _Password = "";
  _Email = "";
  _ConfirmEmail = false;
  _SignIn = false;
  _getAccess = localStorage.getItem("access_token");
  _geRefresh = localStorage.getItem("refresh_token");

  checkSignIn() {
    if (this._getAccess && this._geRefresh)
      this._SignIn = true;
    else
      this._SignIn = false;
    return this._SignIn;
  }

  longOut() {
    this._SignIn = false;
    this._name = "";
    this._nickname = "";
    this._Password = "";
    this._Email = "";
    this._ConfirmEmail = false;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    ManageAllPage.Manage("Home");
  }

  signIn(tockens) {
    const {access_token, refresh_token, success} = tockens;

    if (!success || !access_token || !refresh_token)
      return false;

    localStorage.setItem("access_token", access_token + "")
    localStorage.setItem("refresh_token", refresh_token + "")
    return true;
  }

  //when refresh_token is not expired call for update access_token
  accessRefresh = async () => {
    const res = await FetchRequest("POST", "token/refresh", {_geRefresh, _getAccess});    //call for update access_token

    if (res.state)                                                                      //set data in to Users attributes
      signIn(res);
    else
    {
      longOut();
    }
    console.log(res);
  }

  menegAccsess() {
    if(this.checkSignIn())
    {
      this.accessRefresh();
      console.log("---true---")
    }
    else {
      this.longOut();
    }
  }
}

//parent class
class HtmlElement {
  constructor(name) {
    this._classname = document.querySelector(name);
    this._style = this._classname ? this._classname.style : null;
  }
  DisplayBlock()
  {
    this._style.display = "block";
  }
  DisplayNone()
  {
    this._style.display = "none";
  }
  _classname;
  _style;
}

//confirm Page
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

 async TimeDureationPermission(Home){
    let current = new Date() * 0.0006 + "";
    current = current.substring(0, current.lastIndexOf("."));
    current = 30 - (current - this.TimeDureationStart);
    setTimeout(() => {
      if (User._ConfirmEmail)
        return true;
      if (current <= 0)
      {
        this._style.display = "none";
        User._ConfirmEmail = false;
        Home.DisplayBlock();
        this.ValuesAllEmpty();
        return false;
      }
      else{
        this.TimeDureationPermission(Home)
        this.TimeDureation.innerHTML = current; //minuts
      }
    }, 1000);
  }

  async setDisplayBlock(){
    this.TimeDureation.innerHTML = "";
    this._style.display = "block";
    this.TimeDureationStart =  new Date() * 0.0006 + "";
    this.TimeDureationStart = this.TimeDureationStart.substring(0, this.TimeDureationStart.lastIndexOf("."));
    this.TimeDureationPermission(Home);
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
    console.log("  message " + message)
    this.err.style.color = "red";
    this.err.innerHTML = message;
    this.ValuesAllEmpty();
  }

  //click confirm button and check respons
  async ConfirmPageContinue() {
    this.err.innerHTML = "";
    this.v0.value += ""
    this.v1.value += ""
    this.v2.value += ""
    this.v3.value += ""
    this.v4.value += ""
    //each input must not be empty
    if (!this.v0.value || !this.v1.value || !this.v2.value || !this.v3.value || !this.v4.value)
    {
      this.err.style.color = "red";
      this.err.innerHTML = "all items must be recorded";
    }
    else {
      if (this.v0.value.length !== 1 || this.v1.value.length !== 1 || this.v2.value.length !== 1
              || this.v3.value.length !== 1 || this.v4.value.length !== 1)
      {
        this.ErrorHandling("each element must be one number");
      }
      else {
        //the code must be a string for the request sent
        const code = this.v0.value + "" + this.v1.value + this.v2.value + this.v3.value + this.v4.value;
        const data =  await ControllerCheckReplayCode(code);

        //Error message
        if (!data.state)
        {
          const message = data.message.substring(0, data.message.length - 3);
          this.ErrorHandling(message + "");
        }

        console.log("  data   =  [" + data + "]" + JSON.stringify(data));
        return data;
      }
    }
    return null;
  }
}


//password Page
class PasswordPage extends HtmlElement {
  constructor(){
    super(".PasswordPage")
    this._style.display = "none";
  }
  PasswordConfirm = document.querySelector(".PasswordPageContinue");
  _NewPassword = document.querySelector(".NewPassword");
  _RepeatPassword = document.querySelector(".RepeatPassword");

  PasswordConfirmButton(){
    const NewPasswordError = document.querySelector(".NewPasswordError");
    const RepeatPasswordError = document.querySelector(".RepeatPasswordError")
    NewPasswordError.innerHTML = "";
    RepeatPasswordError.innerHTML = "";
    if (!this._NewPassword.value)
    {
      NewPasswordError.innerHTML = "must not be Empty";
      NewPasswordError.style.color = "red";
      return false;
    }
    if (!PasswordisCorrect(this._NewPassword, NewPasswordError))
    {
      return false;
    }
    if (!this._RepeatPassword.value)
    {
      RepeatPasswordError.innerHTML = "must not be Empty";
      RepeatPasswordError.style.color = "red";
      return false;
    }
    if (!PasswordisCorrect(this._RepeatPassword, RepeatPasswordError))
    {
      return false;
    }
    if (this._RepeatPassword.value !== this._NewPassword.value)
    {
      RepeatPasswordError.innerHTML = "replay password must be equal to password";
      RepeatPasswordError.style.color = "red";
      return false;
    }
    User._Password = this._RepeatPassword.value;
    return true;
  }

  async PasswordConfirmWithServer() {
    let Hash_code = HashCodeGeneration();
    debugger
    return await ControllerPessPassword(Hash_code + "" + User._Password + "" + Hash_code, User);
  }
}

//Signup Page
class SignupPage extends HtmlElement {
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
      User._name = "";
      nameError.innerHTML = "The name must consist of uppercase characters first and then lowercase characters and range from 5 to 15.";
      return false;
    }
    if (!nickname.value || nickname.value.length < 2 || nickname.value.length > 30)
    {
      User._nickname;
      nickError.innerHTML = "The name must contain at least 2 characters and no more than 30.";
      return false;
    }
    User._name = name.value;
    User._nickname = name.value;
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
    debugger
    return await ControllerSignUp(Hash_code + "" + User._Password + "" + Hash_code, User);
  }
}





//login Page 
class LoginPage extends HtmlElement {
  constructor(){
    super(".LoginPage")
    this._style.display = "none";
  }
  _LoginPassword = document.querySelector(".LoginPageinputpassword")
  _LoginEmail = document.querySelector(".LoginPageinput");
  DisplayBlock(){
    this._style.display = "block";
  }

  ButtonSignIn() {
    const ErrorPassword = document.querySelector(".LoginPasswordError");
    const ErrorEmail = document.querySelector(".LoginEmailError");



    
    console.log("email : " +  this._LoginEmail.value + " password :" + this._LoginPassword.value);


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
        console.log("Login Page Email is correct");
        ErrorEmail.style.color = "blue";
        ErrorEmail.innerHTML = "";
      }
      else {
        //Email is not valid
        console.log("Email must by correct");
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

  _LoginPageContinue = document.querySelector(".LoginPageContinue");
}


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
};


// Home Page
class HomePage extends HtmlElement {
  constructor(){
    super(".homeSection");
    this._style.display = "block";
  };

  _Midle = new MiddleSECTION();
  _MiddleSettings = new MiddleSettings();
  _MidleCub = new MidleCub();

  _NAV = {
    _Home : new HtmlElement(".LEFTHOME"),
    _Profile : new HtmlElement(".PROFIL"),
    _GAME : new HtmlElement(".GAME"),
    _LEADERBOARD : new HtmlElement(".LEADERBOARD"),
    _LIVE : new HtmlElement(".LIVE"),
    _SETTINGS : new HtmlElement(".SETTINGS"),
  };
  _NavSigninSignout = {
    _NavSignin : document.querySelector(".NavSignin"),
    _NavSignin1 :  document.querySelector(".RightsigninButton"),

    _NavSignUp : document.querySelector(".NavSignUp"),
    _NavSignUp1 : document.querySelector(".RightgninupButton"),
  }
  ButtonSignIn = (email = "") => {
    if (email.length > 0)
    {

    }
    this._style.display = "none";
  }
  ButtonSignUp = () => {
    this._style.display = "none";
  }

  NavMidleHome = ()=>{
    this._MiddleSettings._style.display = "none";
    this._MidleCub._style.display = "none";
    
    this._Midle._style.display = "flex";
  }

  NavMiddleSettings = ()=>{
    this._Midle._style.display = "none";
    this._MidleCub._style.display = "none";

    this._MiddleSettings._style.display = "flex";
  }

  NavMidleCub = () => {
    this._Midle._style.display = "none";
    this._MiddleSettings._style.display = "none";
    
    this._MidleCub._style.display = "flex";
  }
}

//Middle Sections inside for Home Page

class MiddleSECTION extends HtmlElement {
  constructor(){
    super(".MIDLESECTION")
    this._style.display = "flex";
  }


}

class MiddleSettings extends HtmlElement {
  constructor(){
    super(".MidleSettings")
    this._style.display = "none";
  }


}

class MidleCub extends HtmlElement {
  constructor(){
    super(".MidleCub")
    this._style.display = "none";
  }


}



//-------------------------------------------    Main    -----------




var User = new USER();
var Confirm = new ConfirmPage();
var Login = new LoginPage();
var Register = new RegisterPage();
var Home = new HomePage();
var Password = new PasswordPage();
var SignUp = new SignupPage();


//Event Listeners  Home Page
Home._NAV._SETTINGS._classname.addEventListener("click", Home.NavMiddleSettings);
Home._NAV._LEADERBOARD._classname.addEventListener("click", Home.NavMidleCub);
Home._NAV._Home._classname.addEventListener("click", Home.NavMidleHome);

//sign in
Home._NavSigninSignout._NavSignin.addEventListener("click", ()=> {
  Home.ButtonSignIn();
  Login.DisplayBlock();
})
Home._NavSigninSignout._NavSignin1.addEventListener("click", ()=> {
  Home.ButtonSignIn();
  Login.DisplayBlock();
})

//sign up
Home._NavSigninSignout._NavSignUp.addEventListener("click", ()=> {
  Home.ButtonSignUp();
  Register.DisplayBlock();
})
Home._NavSigninSignout._NavSignUp1.addEventListener("click", ()=> {
  Home.ButtonSignUp();
  Register.DisplayBlock();
})


//RegisterPage click confirm email
Register._RegisterPageContinue.addEventListener("click",  async () => {

    let value = await Register.RegistersWithEmail();
    if (value)
    {
      Register.RegisterPageDisplayNone();
      Confirm.setDisplayBlock(Home);
    }
});

Login._LoginPageContinue.addEventListener("click", async () => {
  if (Login.ButtonSignIn())
  {
    const hash = HashCodeGeneration();
    const data =  await FetchRequest("POST", "login", {"email":Login._LoginEmail.value, "password" : hash + Login._LoginPassword.value + hash})
  
    if (data.state)
    {
      User.signIn(data.message);
      if (User.checkSignIn())
      {
        Login.DisplayNone();
        document.querySelector("#homeNavigation").style.display  = "block";
        document.querySelector(".User").style.display  = "block";
        Home.DisplayBlock();
        Home.NavMidleHome();
      }
    }
  }
})

Confirm.ConfirmYourEmail.addEventListener('click', async () => {
  const data = await Confirm.ConfirmPageContinue();

  Confirm.ValuesAllEmpty();
  if (!data) {
    console.log(" data empty()  ");
    User._ConfirmEmail = false;
  }
  else if (data.state) {
    User._ConfirmEmail = true;
    Confirm.DisplayNone();
    SignUp.DisplayBlock();
  }
  else if (data.message.substr(-3) == "408") {
    User._ConfirmEmail = false;
    Confirm.DisplayNone();
    Home.DisplayBlock();
    Home.NavMidleHome();
  }
})


Password.PasswordConfirm.addEventListener("click", async () => {
  const isCorrectPassword = Password.PasswordConfirmButton();
  if (isCorrectPassword)
  {

   const codeSesion = await Password.PasswordConfirmWithServer();
   console.log("codeSesion = " + codeSesion + " typeof(codeSesion) " + typeof(codeSesion));

  }
})

SignUp.SignupPageContinue.addEventListener("click", async () => {
  const isCorrectPassword = SignUp.PasswordConfirmButton();
  const ischeckNameNickname = SignUp.checkNameNickname();
  if (isCorrectPassword && ischeckNameNickname)
  {
   const codeSesion = await SignUp.PasswordConfirmWithServer();
   if (codeSesion.state)
   {
      SignUp.DisplayNone();
      Login.DisplayBlock();
   }
  }
})



