//user
class USER {
    constructor() {
      this._Name = "";
      this._Nickname = "";
      this._Password = "";
      this._Email = "";
      this._ConfirmEmail = false;
      this._SignIn = false;
      this._Image = "";
      this.date = new Date();
      this._getAccess = localStorage.getItem("access");
      this._geRefresh = localStorage.getItem("refresh");
      this._Id = localStorage.getItem("id");
      this._Gamemode = "Easy";
      this._Twofactor = false;
      this.url42schools ="";
    }
  
    checkSignIn() {
      this._getAccess = localStorage.getItem("access");
      this._geRefresh = localStorage.getItem("refresh");
      this._Id = localStorage.getItem("id");
  
      if (this._getAccess && this._geRefresh && this._Id)
        this._SignIn = true;
      else
        this._SignIn = false;
      return this._SignIn;
    }

    Destruc(){
      this._Id = "";
      this._SignIn = false;
      this._Name = "";
      this._Nickname = "";
      this._Password = "";
      this._Email = "";
      this._Image = "";
      this._ConfirmEmail = false;
      this._Gamemode =  "";
      this._Twofactor =  false;
    }
  
    getAccessTocken(){
      this.checkSignIn();
      return {"access" : this._getAccess, "id" : this._Id};
    }

    async setDataFromBackEnd(){
      // check signin
      if (!await this.menegAccsess())
        return false

      //get for backend data
      const dataUser = await getFetchRequest("api/v1/persons/" + this._Id);

      //get data from dataUser
      const {id, name, nickname, email, image, gamemode, twofactor} = dataUser.message;
      if (!id || !name || !nickname || !email || !image)
        return false;


      this._Name = name;
      this._Nickname = nickname;
      this._Email = email;
      this._ConfirmEmail = true;
      this._SignIn = true;
      this._Image = image;
      this._Gamemode = gamemode || "Easy";
      this._Twofactor = twofactor || false;
      return true
    }


    setData(data){
      debugger
      this._Name = data.name;
      this._Nickname = data.nickname;
      this._Email = data.email;
      this._Image = data.image;
      this._Gamemode = data.gamemode;
      this._Twofactor = data.twofactor;
    }


    //when refresh_token is not expired call for update access
    accessRefresh = async () => {
      const res = await FetchRequest("POST", "api/v1/token/refresh", {"refresh" : this._geRefresh});    //call for update access

      this.date = new Date();

      if (res?.state)
      {
        myStorages.setAccsessTockenLoading(res?.message?.data)
        return true;
      }
      else
      {
        myStorages.longOut();
        ManageAllPage.Manage("Home");
        return false;
      }
    }
    async setDataFromBeckendTackIntra42(DataItem){
      this._Name = DataItem.user.name;
      this._Nickname = DataItem.user.nickname
      this._ConfirmEmail = DataItem.success;
      this._SignIn = true;
      this._Image = DataItem.user.image;
      this.date = new Date();
      this._getAccess = localStorage.getItem("access");
      this._Id = localStorage.getItem("id");
      this._Gamemode = "Easy";
      this._Twofactor = false;
    }

  async menegAccsess() {
    if (!this.checkSignIn())
      return false;
    if(new Date().getMinutes() - this.date.getMinutes() > 1440)
    {
      if (await this.accessRefresh())
        true
      else{
        false;
      }
    }
    else {
      return true;
    }
  }
}
