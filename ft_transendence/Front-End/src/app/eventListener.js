//-----------------------------------------------------------------------   Home
//Event Listeners  Home Page
Home._NAV._SETTINGS._classname.addEventListener("click",()=>{
  ManageMidle.Manage("MidleSettings")
})
Home._NAV._LEADERBOARD._classname.addEventListener("click",()=>{
  ManageMidle.Manage("MidleCub");
} )
Home._NAV._Home._classname.addEventListener("click",()=>{
  ManageMidle.Manage("midle");
} );

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
  ManageAllPage.Manage("Home");
})

//---------------------------------------------------------------------   Login


Login._LoginPageContinue.addEventListener("click", async () => {
  debugger
  if (Login.ButtonSignIn())
  {
    const hash = HashCodeGeneration();
    const data =  await FetchRequest("POST", "login", {"email":Login._LoginEmail.value, "password" : hash + Login._LoginPassword.value + hash})

    Password.errorSetNull();

    if (data.state)
    {
      myStorages.setStorageLogin(data?.message?.data)
      if (User.checkSignIn())
      {
        ManageAllPage.Manage("Home");
        ManageMidle.Manage("midle");
        
        
        Login._LoginEmail.value = "";
        Login._LoginPassword.value = "";
      }
    }
    else{
      Password.notFined();
    }
  }
})

//when forgot password
Login._LoginPageForgot.addEventListener("click", () => {
  debugger
  ManageAllPage.Manage("ResetPage");
  ManageMidle.Manage("");
  console.log("Clicked!");
})


//-------------------------------------------------------------------  Reset

let isReset = false;


Reset._ConfirmReset.addEventListener('click', async () => {
  debugger
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
  debugger
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
    ManageMidle.Manage("midle");
    ManageAllPage.Manage("Home")
  }
  isReset = false;
})


//-------------------------------------------------------------------  Password

Password.PasswordConfirm.addEventListener("click", async () => {
  debugger
  const isCorrectPassword = Password.PasswordConfirmButton();
  if (isCorrectPassword)
  {
    const codeSesion = await Password.PasswordConfirmWithServer();
    console.log("codeSesion = " + codeSesion + " typeof(codeSesion) " + typeof(codeSesion));
    
    if (codeSesion.state)
    {
      myStorages.longOut();
      ManageAllPage.Manage("Login");
    }
  }
})


//-------------------------------------------------------------------  SignUp

SignUp.SignupPageContinue.addEventListener("click", async () => {
  debugger
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
