class MiddleSettings extends HtmlElement {
    constructor(){
      super(".MidleSettings")
      this._style.display = "none";
    }
    
    _Save = document.querySelector("#DeleteAccountSaveSave");
    _DeleteAccount = document.querySelector("#DeleteAccountSaveAccount");
    _ImageFileAccess = document.querySelector("#ImageFileAccess")                        //Edit Profile Photo.

    _MidleSettingsHeroName = document.querySelector(".MidleSettingsHeroName");
    _MidleSettingImage = document.querySelector(".MidleSettingImage");
    
    changeUser(){
      this._MidleSettingsHeroName.innerHTML = User._Name;
      this._MidleSettingImage.src =  `data:image/png;base64,${User._Image}`;
    }

    //For medium settings, you need to check that all arguments are empty, and when they are, do nothing
    isArgumentsEmpty(){
      const MidleSettingsBlocksPName = document.querySelector("#MidleSettingsBlocksPName");
      const MidleSettingsBlocksPGameMode = document.querySelector("#MidleSettingsBlocksPGameMode");
      const MidleSettingsBlocksPEditProfileUsername = document.querySelector("#MidleSettingsBlocksPEditProfileUsername");
      const MidleSettingsBlocksP2FAAuthenticator = document.querySelector("#MidleSettingsBlocksP2FAAuthenticator");
      const MidleSettingsBlocksPEmail = document.querySelector("#MidleSettingsBlocksPEmail");
      const MidleSettingsBlocksPPassword = document.querySelector("#MidleSettingsBlocksPPassword");
      const ImageFileAccess = document.querySelector("#ImageFileAccess");
      if (!MidleSettingsBlocksPName.value && !MidleSettingsBlocksPGameMode.value && !MidleSettingsBlocksPEditProfileUsername.value && !MidleSettingsBlocksP2FAAuthenticator.value && !MidleSettingsBlocksPEmail.value && !MidleSettingsBlocksPPassword.value && !ImageFileAccess.value)
          return false;
        return true;

    }

    //for settings middle need to check the password
    checkPassword(){
      const NewPasswordError = document.querySelector("#MidleSettingsBlocksPChangePassword");
      const  RepeatPassword = document.querySelector("#MidleSettingsBlocksPPassword");
    
      NewPasswordError.innerHTML = "";

      if (!RepeatPassword.value)
        return true;

      if (!PasswordisCorrect(RepeatPassword, NewPasswordError))
      {
        RepeatPassword.value = "";
        return false;
      }
      NewPasswordError.innerHTML = "";

      return true;
    }
    //for settings middle need to check the email
    checkValidEmail(){
      // MidleSettingsBlocksPEmail
      const Email = document.querySelector("#MidleSettingsBlocksPEmail");
      const ErrorEmail = document.querySelector("#MidleSettingsBlocksPEmailErrorhandling");
      
      ErrorEmail.innerHTML = "";
      if (!Email.value)
        return true;

      const respons =  ValidateEmail(Email.value);
      if (!respons || respons[0] !== "V")
      {
        ErrorEmail.innerHTML = "Email is not correct";
        ErrorEmail.style.color = "red";
        Email.value = "";
        return false;
      }
      return true;
    } 
    //for the middle section the backend needs to be changed, 
    //for that I need to load all the data and send white fetch
    async changeData(){
      const profilName = document.querySelector("#MidleSettingsBlocksPName")                    //"Edit Profile Name
      const gameMode = document.querySelector("#MidleSettingsBlocksPGameMode")                  //Game Mode
      const userName = document.querySelector("#MidleSettingsBlocksPEditProfileUsername")       //Edit Profile Username
      const P2FAAuthenticator = document.querySelector("#MidleSettingsBlocksP2FAAuthenticator") //2FAAuthenticator
      const email = document.querySelector("#MidleSettingsBlocksPEmail")                         //Edit Profile Email.
      const NewPassword = document.querySelector("#MidleSettingsBlocksPPassword")             //MidleSettingsBlocksPPassword

      const newUser = {
        "name":profilName.value,
        "nickname": userName.value,
        "email":email.value,
        "image": base64EncodedImage,
        "password":NewPassword.value,
        "gamemode":gameMode.value,
        "twofactor":P2FAAuthenticator.value
      }
      const data = await putRequest("PUT", `api/v1/settings/${User._Id}`, newUser);
      if (data &&  data.state)
      {
        User.setData(data.message)
      }
      profilName.value = "";             //"Edit Profile Name
      gameMode.value = "";               //Game Mode
      userName.value = "";               //Edit Profile Username
      P2FAAuthenticator.value = "";      //2FAAuthenticator
      email.value = "";                  //Edit Profile Email.
      NewPassword.value = "";            //MidleSettingsBlocksPPassword
      ManageAllPage.Manage("Home");
    }
    async draw(){
      await this.changeUser();
    }
  
  }