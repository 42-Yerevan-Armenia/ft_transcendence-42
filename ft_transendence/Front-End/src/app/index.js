// document.getElementById("myBtn").addEventListener("click", displayDate);
// element.addEventListener("click", function(){ alert("Hello World!"); });
// element.addEventListener("click", myFunction);

// function myFunction() {
//   alert ("Hello World!");
// }



// window.addEventListener("resize", function(){
//     document.getElementById("demo").innerHTML = sometext;
//   });
// element.removeEventListener("mousemove", myFunction);

class USER{
  constructor(Name, Password) {
    this._name = Name;
    this._Password = Password;
  }
  _name = "Name";
  _Password = "password";
}
//------------------------------------------         Utils          -------------------------------

function ValidateEmail(input) {

  console.log("1input =[" + input  + "]");
  if (!input)
  {
    return "Invalid email address!";
  }
  // var validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  console.log("2input =" + input);
  if (input?.match(validRegex)) {

    console.log("Valid email address!");


    return "Valid email address!";

  } else {

    console.log("Invalid email address!");

    // document.form1.text1.focus();

    return "Invalid email address!";

  }

}



//-------------------------------------------------       pages     ---------------------------------------- 





class HtmlElement {
  constructor(name){
    this._classname = document.querySelector(name);
    this._style = this._classname ? this._classname.style : null;
  }
  _classname;
  _style;
}


class ConfirmPage extends HtmlElement{
  constructor(){
    super(".ConfirmPage")
    this._style.display = "none";
  }
}

class LoginPage extends HtmlElement{
  constructor(){
    super(".LoginPage")
    this._style.display = "none";
  }

  DisplayBlock(){
    this._style.display = "block";
  }

  ButtonSignIn(){
    ErrorPassword = querySelector(".LoginPasswordError");
    ErrorEmail = querySelector(".LoginEmailError");
    LoginPassword = querySelector(".LoginPageinputpassword")
    LoginEmail = querySelector(".LoginPageinput")

    if (!LoginEmail?.value)
    {
      ErrorEmail.style.color = "red";
      ErrorEmail.innerHTML = "Email must not be empty";
      return ;
    }
    else {
      const ContextValidation = ValidateEmail(LoginEmail.value);

      if (ContextValidation[0] == 'V') {
        console.log("Login Page Email is correct");
        ErrorEmail.style.color = "blue";
        ErrorEmail.innerHTML = "";
      }
      else {
        console.log("Email must by correct");
        ErrorEmail.style.color = "red";
        ErrorEmail.innerHTML = ContextValidation;
        return false;
      }
    }
    if (!LoginPassword?.value)
    {
      ErrorPassword.style.color = "red";
      ErrorPassword.innerHTML = "Password must not be empty";
      return ;
    }
    else{
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



class RegisterPage extends HtmlElement{
  constructor(){
    super(".RegisterPage")
    this._style.display = "none";
  }

  RegisterPageDisplayNone(){
    this._style.display = "none";
  }
  
  DisplayBlock(){
    this._style.display = "block";
  }
  
  RegistersWithEmail(){
    let err = document.querySelector(".RegisterErrorHandling");
    let _RegisterPageinput = document.querySelector(".RegisterPageinput");
    
    const ContextValidation = ValidateEmail(_RegisterPageinput.value);
    
    if (ContextValidation[0] == 'V') {
      console.log("Email is correct must be");
      err.style.color = "blue";
      err.innerHTML = ContextValidation;
      err.innerHTML = "";
      return _RegisterPageinput.value;
    }
    else {
      console.log("Email must by correct");
      err.style.color = "red";
      err.innerHTML = ContextValidation;
      return false;
    }
  };
  _RegisterPageContinue = document.querySelector(".RegisterPageContinue");
}




// -------------------------- Midle Sections
//sections inside Home page
class MidleSECTION extends HtmlElement{
  constructor(){
    super(".MIDLESECTION")
    this._style.display = "flex";
  }
}
class MidleSettings extends HtmlElement{
  constructor(){
    super(".MidleSettings")
    this._style.display = "none";
  }


}

class MidleCub extends HtmlElement{
  constructor(){
    super(".MidleCub")
    this._style.display = "none";
  }


}



class HomePage extends HtmlElement{
  constructor(){
    super(".homeSection");
    this._style.display = "block";
  };

  _Midle = new MidleSECTION();
  _MidleSettings = new MidleSettings();
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
    this._MidleSettings._style.display = "none";
    this._MidleCub._style.display = "none";
    
    this._Midle._style.display = "flex";
  }

  NavMidleSettings = ()=>{
    this._Midle._style.display = "none";
    this._MidleCub._style.display = "none";

    this._MidleSettings._style.display = "flex";
  }

  NavMidleCub = () => {
    this._Midle._style.display = "none";
    this._MidleSettings._style.display = "none";
    
    this._MidleCub._style.display = "flex";
  }
}

const User = new USER();
const Confirm = new ConfirmPage();
const Login = new LoginPage();
const Register = new RegisterPage();
const Home = new HomePage();


//Event Listeners  Home Page
Home._NAV._SETTINGS._classname.addEventListener("click", Home.NavMidleSettings);
Home._NAV._LEADERBOARD._classname.addEventListener("click", Home.NavMidleCub);
Home._NAV._Home._classname.addEventListener("click", Home.NavMidleHome);
//sign in
Home._NavSigninSignout._NavSignin.addEventListener("click",()=>{
  Home.ButtonSignIn();
  Login.DisplayBlock();
})
Home._NavSigninSignout._NavSignin1.addEventListener("click",()=>{
  Home.ButtonSignIn();
  Login.DisplayBlock();
})

//sign up
Home._NavSigninSignout._NavSignUp.addEventListener("click",()=>{
  Home.ButtonSignUp();
  Register.DisplayBlock();
})
Home._NavSigninSignout._NavSignUp1.addEventListener("click",()=>{
  Home.ButtonSignUp();
  Register.DisplayBlock();
})

Register._RegisterPageContinue.addEventListener("click", ()=>{
  let value = Register.RegistersWithEmail();

  if (value)
  {
    Register.RegisterPageDisplayNone();
    Login.SignInWithEmail(value);
  }
});

Login._LoginPageContinue.addEventListener("click", ()=>{
  Login.ButtonSignIn();
})