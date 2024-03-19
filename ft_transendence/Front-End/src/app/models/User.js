//user
class USER {
  debugger
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
    }
  
    getAccessTocken(){
      this.checkSignIn();
      return {"access" : this._getAccess, "id" : this._Id};
    }

    async setDataFromBackEnd(){
      debugger
      // check signin
      if (!await this.menegAccsess())
        return false

      //get for backend data
      const dataUser = await getFetchRequest("users");

      //get data from dataUser
      const {id, name, nickname, email, image} = dataUser;
      if (!id || !name || !nickname || !email || !image)
        return false;

      this._Name = name;
      this._Nickname = nickname;
      this._Email = email;
      this._ConfirmEmail = true;
      this._SignIn = true;
      this._Image = image;

    }

    //when refresh_token is not expired call for update access
    accessRefresh = async () => {
      this._geRefresh = localStorage.getItem("refresh");
      const res = await FetchRequest("POST", "api/v1/token/refresh", {"refresh" : this._geRefresh});    //call for update access
      this.date = new Date();
  
      if (res?.state && myStorages.setAccessRefreshToStorage(res?.message?.data))
      {
        // myStorages.setStorageLogin(res?.message?.data)
        
        return true;
      }
      else
      {
        myStorages.longOut();
        ManageAllPage.Manage("Home");
        return false;
      }
    }
  
   async menegAccsess() {
      if (!this.checkSignIn())
        return false;
      if(new Date().getMinutes() - this.date.getMinutes() > 13)
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
  