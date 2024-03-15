//user
class USER {
  debugger
    constructor() {
      this._name = "";
      this._nickname = "";
      this._Password = "";
      this._Email = "";
      this._ConfirmEmail = false;
      this._SignIn = false;
      this._Imag = "";
      this.date = new Date();
      this._getAccess = localStorage.getItem("access");
      this._geRefresh = localStorage.getItem("refresh");
    }
  
    checkSignIn() {
      this._getAccess = localStorage.getItem("access");
      this._geRefresh = localStorage.getItem("refresh");
  
      if (this._getAccess && this._geRefresh)
        this._SignIn = true;
      else
        this._SignIn = false;
      return this._SignIn;
    }
    Destruc(){
      this._SignIn = false;
      this._name = "";
      this._nickname = "";
      this._Password = "";
      this._Email = "";
      this._Imag = "";
      this._ConfirmEmail = false;
    }
  
  
  
    //when refresh_token is not expired call for update access
    accessRefresh = async () => {
      this._geRefresh = localStorage.getItem("refresh");
      const res = await FetchRequest("POST", "api/v1/token/refresh", {"refresh" : this._geRefresh});    //call for update access
      this.date = new Date();
  
      if (res?.state)
      {
        // myStorages.setStorage(res?.message?.data)
        myStorages.setStorageLogin(res?.message?.data)
        return true;
      }
      else
      {
        myStorages.longOut();
        ManageAllPage.Manage("Home");
        return false;
      }
    }
  
    menegAccsess() {
      if (!this.checkSignIn())
        return false;
      if(new Date().getMinutes() - this.date.getMinutes() > 13)
      {
        if (this.accessRefresh())
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
  