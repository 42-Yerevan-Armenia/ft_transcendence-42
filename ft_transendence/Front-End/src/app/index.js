const HostPort="http://localhost:5001"


//#################################################################################   Controller.js

//queshon too backend Email exist or not and 
//if create 
async function ControllerCheckEmail(email) {
  try {
    debugger
    const response = await fetch(`${HostPort}/registerpage?email=${email}`);

    if (!response.ok)
    {
      throw Error("Error: Whene Email check status: " + response.status)
    }
    const result = await response.json();
    console.log(JSON.stringify(result, undefined, 2));
    console.log("Succsse++++++++++++++++++++");
    return {state:true, massage: result.message};
  }
  catch(err) {
    return {state:false, "massage": err };
  }
}


async function ControllerCheckReplayCode(code){
  try {
    const respons = await fetch(`${HostPort}/confirm`, {
      method : 'Post',
      body : code,
      header: {'Content-Type' : 'application/json'}
    })
    if (!respons.ok)
      throw new Error("Code is not correct");
    const data = respons.json();
    return data;
  }
  catch(err) {
    console.log("Error : " + err);
  }
}


// RegisterPageContinue

// function ControllerHandleFormSubmit() {
//   preventDefault();
//   let email = "";
//   let password = "";
//   try {
//       fetch('http://10.12.11.2:8000/', {
//           method: 'Post',
//           body: JSON.stringify({email, password}),
//           headers: {'Content-Type' : 'application/json'}
//       }).then((data)=> {
//           console.log("EEEEEEE=");
//           console.log(JSON.stringify(data, null, 2));
//       })
//   }
//   catch(e) {
//       console.log("fetch error [" + e + "]");
//   }
// }



// try {
//   const respons  = await fetch(`${HostPort}/confirm`, {
//     method: 'Post',
//     body: code,
//     headers: {'Content-Type': 'application/json'}
//   })
//   if (!respons.ok)
//   {
//     throw new Error("Code is not correct");
//   }
//   const data = respons.json();
//   return data;
// }
// catch(err) {
// console.log("Error : " + err);
// }

// }








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



//-------------------------------------------------       Pages     ---------------------------------------- 

//user
class USER{
  constructor(Name, Password) {
    this._name = Name;
    this._Password = Password;
  }
  _name = "Name";
  _Password = "password";
}

//parent class
class HtmlElement {
  constructor(name) {
    this._classname = document.querySelector(name);
    this._style = this._classname ? this._classname.style : null;
  }
  _classname;
  _style;
}

//confirm Page
class ConfirmPage extends HtmlElement{
  constructor() {
    super(".ConfirmPage")
    this._style.display = "none";
  }
  ConfirmYourEmail = document.querySelector('ConfirmPageContinue');
  setDisplayBlock(){
    this._style.display = "block";
  }

  async ConfirmPageContinue(){
    let v0 = document.querySelector(".ConfirmPagepassword0");
    let v1 = document.querySelector(".ConfirmPagepassword1");
    let v2 = document.querySelector(".ConfirmPagepassword2");
    let v3 = document.querySelector(".ConfirmPagepassword3");
    let v4 = document.querySelector(".ConfirmPagepassword4");

    if (!v0 || !v1 || !v2 || !v3 || !v4)
    {
      const err = document.querySelector(".ErrorConfirmPageCode");
      err.style.color = "red";
      err.innerHTML = "all items must be recorded";
    }
    else {
      const code = v0 + " " + v1 + " " + v2 + " " + v3 + " " + v4;
      const data =  await ControllerCheckReplayCode(code);
      return data;
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
        return _RegisterPageinput.value;
    }
    err.style.color = "orange";
    err.innerHTML = result?.massage | "Error";
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
  _NavSigninSignout ={
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

const User = new USER();
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

  console.log("OK");
    let value = await Register.RegistersWithEmail();
    if (value)
    {
      Register.RegisterPageDisplayNone();
      Confirm.setDisplayBlock();
    }
});

Login._LoginPageContinue.addEventListener("click", () => {
  Login.ButtonSignIn();
})

Confirm.ConfirmYourEmail.addEventListener('click', async () => {
  const data = await Confirm.ConfirmPageContinue();
  if (data)
  {
    console.log(" data  " + data);
  }
})
