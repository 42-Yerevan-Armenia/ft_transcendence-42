
class MiddleSettings extends HtmlElement {
    constructor(){
      super(".MidleSettings")
      this._style.display = "none";
    }
    _Save = document.querySelector("#DeleteAccountSaveSave");
    _DeleteAccount = document.querySelector("#DeleteAccountSaveAccount");

    _MidleSettingsHeroName = document.querySelector(".MidleSettingsHeroName");
    _MidleSettingImage = document.querySelector(".MidleSettingImage");
    
    changeUser(){
      this._MidleSettingsHeroName.innerHTML = User._Name;
      this._MidleSettingImage.src =  `data:image/png;base64,${User._Image}`;;
    }

    async changeData(){
      debugger
      const profilName = document.querySelector("#MidleSettingsBlocksPName")                    //"Edit Profile Name
      const gameMode = document.querySelector("#MidleSettingsBlocksPGameMode")                  //Game Mode
      const userName = document.querySelector("#MidleSettingsBlocksPEditProfileUsername")       //Edit Profile Username
      const P2FAAuthenticator = document.querySelector("#MidleSettingsBlocksP2FAAuthenticator")//2FAAuthenticator
      const ImageFileAccess = document.querySelector("#ImageFileAccess")                        //Edit Profile Photo.
      const email = document.querySelector("#MidleSettingsBlocksPEmail")                         //Edit Profile Email.
      const changePassword = document.querySelector("#MidleSettingsBlocksPPassword")             //MidleSettingsBlocksPPassword
      const newUser = {
        "name":profilName.value,
        "nickname": userName.value,
        "email":email.value,
        "image": ImageFileAccess.value,
        "password":changePassword.value,
        "gamemode":gameMode.value,
        "twofactor":P2FAAuthenticator.value
      }
      const data = await putRequest("PUT", `api/v1/settings/${User._Id}`, newUser);
      if (data &&  data.state)
      {
        console.log("New Data  == 11111111111111")
        console.log(data.message);
        User.setData(data.message)
      }
      ManageAllPage.Manage("Home");
    }
    async Drow(){
      await this.changeUser();
    }
  
  }