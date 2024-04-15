//-----------------------------------------------------------------------   Home
//Event Listeners  Home Page

//2
Home._NAV._SETTINGS._classname?.addEventListener("click",()=>{
  //debugger
  ManageMidle.Manage("MidleSettings")
})


Home._MiddleSettings?._Save?.addEventListener("click",async ()=>{
  console.log("SAVE")





  await Home._MiddleSettings.changeData();
})


Home._MiddleSettings?._DeleteAccount.addEventListener("click",async ()=>{
  console.log("_DeleteAccount")

  const deleteUser = await FetchRequest("DELETE", `api/v1/settings/${User._Id}`,{});
  
  myStorages.longOut();
})


Home._NAV?._Profile?._classname?.addEventListener("click", async ()=>{
  console.log("Home._NAV?._Profile?._classname?.addEventListener");
  ManageMidle.Manage("ProfileMidle");
})

// ProfileMidleHeaderToInvit
Home?._HomeMidleProfile?._ProfileMidleHeaderToInvit1?.addEventListener("click",async ()=>{
  console.log("_ProfileMidleHeaderToInvit call1");



  ManageMidle.Manage("MidleHistoryGame");

  
})
Home?._HomeMidleProfile?._ProfileMidleHeaderToInvit2?.addEventListener("click",async ()=>{
  console.log("_ProfileMidleHeaderToInvit call2");


  ManageMidle.Manage("MidleHistoryGame");


})



//JoinList Invite Button
// #JoinListHeroDivButtonBInvite
Home?._MidleJoinList?._InviteButton?.addEventListener("click",async ()=>{             //  --------------------
  console.log("_ProfileMidleHeaderToInvit call2");


  await ManageMidle.Manage("JoinListInvite");


})




// 1
Home._NAV?._LEADERBOARD?._classname?.addEventListener("click",()=>{
  //debugger
  ManageMidle.Manage("MidleCub");
} )

//4
Home._NAV?._JoinListGame?._classname?.addEventListener("click",()=>{
  //debugger
  ManageMidle.Manage("JoinList");

} )

//3
Home._NAV?._Home?._classname?.addEventListener("click",()=>{
  //debugger
  ManageMidle.Manage("midle");
} );


//whene create new list item for game
//_MidleJoinList Create button
Home._MidleJoinList?._CreateButton?.addEventListener("click", async ()=>{
  debugger
  console.log("click... \n");
  const Players = document.querySelector("#JoinListHeroDivProfilPlayers");
  const LiveOnOff = document.querySelector("#LiveOnOff");
  const JoinTheme = document.querySelector("#JoinTheme");
  const JoinListHeroDivGameMode = document.querySelector("#JoinListHeroDivGameMode");
  console.log(Players.value);
  const objCreate = {
    max_players:Players.value,
    live:LiveOnOff.value,
    theme:JoinTheme.value,
    gamemode:JoinListHeroDivGameMode.value,
    
  };

  //send back-end
  const url = "api/v1/createroom/" + User._Id;
  await FetchRequest("POST", url, objCreate);

  //redirect
  ManageMidle.Manage("JoinList");
// api/v1/createroom/:id
  Players.value = "";
  LiveOnOff.value = "";
  JoinTheme.value = "";
  JoinListHeroDivGameMode.value = "";
  // LiveOnOff
})

//sign in
Home._NavSigninSignout?._NavSignin?.addEventListener("click", ()=> {
  Home.ButtonSignIn();
  Login.DisplayBlock();
})
Home._NavSigninSignout?._NavSignin1?.addEventListener("click", ()=> {
  Home.ButtonSignIn();
  Login.DisplayBlock();
})

//sign up
Home._NavSigninSignout?._NavSignUp.addEventListener("click", async ()=> {
  Home.ButtonSignUp();
  await Register.DisplayBlock();
})
Home._NavSigninSignout?._NavSignUp1.addEventListener("click", ()=> {
  Home.ButtonSignUp();
  Register.DisplayBlock();
})




Home._HomeLeft?._ExploreMessag?.addEventListener("click",  ()=>{
  if (!User.checkSignIn())
    return;



  const style = Home._HomeMessage?._style;
  console.log("d.display == " + style.display)

  const flag = style.display == "none" ? "block" : "none";

  if (flag == "block")
    ManageRight.Manage("Message");
  else
  style.display = "none";
})

//-------------------------------------------------------------------- left User
// IconExit
Home._HomeLeft._LongOut.addEventListener("click", async () => {

  myStorages.longOut();
  await ManageAllPage.Manage("Home");
})
Home._HomeLeft._NavLoginOut.addEventListener("click", async () => {

  myStorages.longOut();
  await ManageAllPage.Manage("Home");
})

//---------------------------------------------------------------------   Login

//when want to login you press button login
Login?._LoginPageContinue?.addEventListener("click", async () => {
  //debugger
  //check is correct email and password
  if (Login.ButtonSignIn())
  {
    //code random 10 numbers
    const hash = HashCodeGeneration();

    //respons beck-end to tack user
    const data =  await FetchRequest("POST", "login", {"email":Login._LoginEmail.value, "password" : hash + Login._LoginPassword.value + hash})

    //error div innerHTML =""
    Password.errorSetNull();

    if (data.state)
    {
      //set local storage data access and refresh tokin
      myStorages.setStorageLogin(data?.message?.data)
      if (User.checkSignIn())
      {
        ManageAllPage.Manage("Home");
        
        Login._LoginEmail.value = "";
        Login._LoginPassword.value = "";
      }
    }
    else{
      //set error in frontend
      Password.notFined();
    }
  }
})

// when forgot password
Login?._LoginPageForgot?.addEventListener("click", () => {
  //debugger
  ManageAllPage.Manage("ResetPage");
  ManageMidle.Manage("");
})


//-------------------------------------------------------------------  Reset

let isReset = false;


Reset?._ConfirmReset?.addEventListener('click', async () => {
  //debugger
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
  //debugger
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
    User._ConfirmEmail = false;
  }
  else if (data.state) {
    User._ConfirmEmail = true;
    Confirm.DisplayNone();
    await SignUp.DisplayBlock();
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
  //debugger
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
  //debugger
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

//RegisterPage click confirm email
Register?._RegisterPageContinue?.addEventListener("click",  async () => {
  //debugger
      let value = await Register.RegistersWithEmail();
      if (value)
      {
        Register.RegisterPageDisplayNone();
        Confirm.setDisplayBlock(Home);
      }
});
  

Login._ContinueWith42Intra.addEventListener("click", async () => {
  const respons =  await Login.Get42Connect();
})


