// const HostPort="http://localhost:5001"
const HostPort="http://10.12.11.2:8000"

//#################################################################################   Controller.js

//queshon too backend Email exist or not and 
//if create 
async function ControllerCheckEmail(email) {
  try {
    // const response = await fetch(`${HostPort}/registerpage?email=${email}`,{
    const response = await fetch(`${HostPort}/email_validation/`,{
      method: 'POST',
      body: JSON.stringify({email:email}),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok)
    {
      throw new  Error("Error: Whene Email check status " + response.status)
    }
    const result = await response.json();

    if (!result || typeof result !== 'object') {
      throw new Error("Invalid response data");
    }
    return {state:true, message: result.message};
  }
  catch(err) {
    let error;
    if (err)
      error = err  + "";
    else
      error = "Error: Server";
    return {state:false, "message": error};
  }
}


async function ControllerCheckReplayCode(code) {
  try {
      const response = await fetch(`${HostPort}/confirm`, {
          method: 'POST',
          body: JSON.stringify({ code: code }), // Assuming you want to send the code as JSON
          headers: { 'Content-Type': 'application/json' } // Fixed 'header' to 'headers'
      });
      if (!response.ok)
        throw new Error(response.statusText  + " " + response.status);

      const data = await response.json(); // Await the parsing of JSON data

      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response data");
      }

      return{state:true, "message": data };
  }
  catch (err) {
    
    const error = err + "";
    
    console.log("error   === [" + error + "]")
    
    return {state:false, "message": error};
  }
}


async function ControllerPessPassword(password, User) {
  console.log("ControllerPessPassword");
  try {
    const response = await fetch(`${HostPort}/password`, {
      method: 'POST',
      body: JSON.stringify({ code: password, email: User._Email }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to update password. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error("Invalid response data");
    }

    console.log("Response data:", data);
    console.log("ControllerPessPassword  Succsse++++++++++++++++++++");
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}

// ################################################################################# Main.js


//Utils
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
class USER{
  constructor() {
  }
  _name = "";
  _Password = "";
  _Email = "";
  _ConfirmEmail = false;
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

  async PasswordConfirmWithServer()
  {
    let Hash_code = HashCodeGeneration();
    debugger
    return await ControllerPessPassword(Hash_code + "" + User._Password + "" + Hash_code, User);
  }
}




//login Page 
class LoginPage extends HtmlElement {
  constructor(){
    super(".LoginPage")
    this._style.display = "none";
  }

  DisplayBlock(){
    this._style.display = "block";
  }

  ButtonSignIn() {
    ErrorPassword = querySelector(".LoginPasswordError");
    ErrorEmail = querySelector(".LoginEmailError");
    LoginPassword = querySelector(".LoginPageinputpassword")
    LoginEmail = querySelector(".LoginPageinput");

    if (!LoginEmail?.value) 
    {//if empty email
      ErrorEmail.style.color = "red";
      ErrorEmail.innerHTML = "Email must not be empty";
      return ;
    }
    else {
      const ContextValidation = ValidateEmail(LoginEmail.value);

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


    if (!LoginPassword?.value) {
      ErrorPassword.style.color = "red";
      ErrorPassword.innerHTML = "Password must not be empty";
      return ;
    }
    else {
      if (LoginPassword.value.length >= 8 && LoginPassword.value.length <= 15)
      {

      }
    }

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
const Confirm = new ConfirmPage();
const Login = new LoginPage();
const Register = new RegisterPage();
const Home = new HomePage();
const Password = new PasswordPage();


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

Login._LoginPageContinue.addEventListener("click", () => {
  Login.ButtonSignIn();
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
    Password.DisplayBlock();
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