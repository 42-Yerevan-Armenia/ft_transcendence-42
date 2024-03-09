var User = new USER();
var Confirm = new ConfirmPage();
var Login = new LoginPage();
var Register = new RegisterPage();
var Reset = new ResetPageA();
var Home = new HomePage();
var Password = new PasswordPage();
var SignUp = new SignupPage();

//-----------------------------------------------------------------------   Home
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
debugger
    let value = await Register.RegistersWithEmail();
    if (value)
    {
      Register.RegisterPageDisplayNone();
      Confirm.setDisplayBlock(Home);
    }
});



//-------------------------------------------------------------------- left User
// IconExit
Home._HomeLeft._LongOut.addEventListener("click", () => {
  myStorages.longOut();
  
})

//---------------------------------------------------------------------   Login


Login._LoginPageContinue.addEventListener("click", async () => {
  debugger
  if (Login.ButtonSignIn())
  {
    const hash = HashCodeGeneration();
    const data =  await FetchRequest("POST", "login", {"email":Login._LoginEmail.value, "password" : hash + Login._LoginPassword.value + hash})
  
    if (data.state)
    {
      myStorages.setStorageLogin(data?.message?.data)
      if (User.checkSignIn())
      {
        Login.DisplayNone();
        Home._Midle.func();
        Home.DisplayBlock();
        Home.NavMidleHome();
        
        Home._HomeLeft.Drow();
        
        Login._LoginEmail.value = "";
        Login._LoginPassword.value = "";
      }
    }
  }
})

//when forgot password
Login._LoginPageForgot.addEventListener("click", () => {
  ManageAllPage.Manage("ResetPage");
  ManageMidle.Manage("");
  console.log("Clicked!");
})


//-------------------------------------------------------------------  Reset

let isReset = false;


Reset._ConfirmReset.addEventListener('click', async () => {
  const isValid = Reset.checkValidEmail();
  if (!isValid)
    return ;

  const res = await Reset.ResetEmail();
  
  if (!res)
    return ;

  ManageAllPage.Manage("Confirm");
  Confirm.setDisplayBlock(Home);
  isReset = true;
})

//-------------------------------------------------------------------  Confirm  ---------

Confirm.ConfirmYourEmail.addEventListener('click', async () => {

  const data = await Confirm.ConfirmPageContinue(isReset);
  Confirm.ValuesAllEmpty();

  //when came this page in Reset Password page
  if (isReset)
  {
    Confirm.setDisplayBlock(Home);
    if (!data || !data.state)
    {
      ManageAllPage.Manage("ResetPage");
      return ;
    }
    User._ConfirmEmail = true;
    ManageAllPage.Manage("Password");     //go to password page for create new password
    return ;
  }

  //when came this page Welcome to ft_transcendence
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
  isReset = false;
})


//-------------------------------------------------------------------  Password

Password.PasswordConfirm.addEventListener("click", async () => {
  const isCorrectPassword = Password.PasswordConfirmButton();
  if (isCorrectPassword)
  {
    const codeSesion = await Password.PasswordConfirmWithServer();
    console.log("codeSesion = " + codeSesion + " typeof(codeSesion) " + typeof(codeSesion));
    
    if (codeSesion.state)
    {
      myStorages.longOutGoLogin();
      ManageAllPage.Manage("Login");
    }
  }
})


//-------------------------------------------------------------------  SignUp

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
