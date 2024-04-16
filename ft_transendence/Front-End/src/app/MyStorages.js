//hovhannes_vardanyan1@mail.ru
//Hovo@1234
//-------------------------------------------------       browser storage     ----------------------------------------

//manag browser storage
const myStorages = {
    setStorageLogin(tockens) {
      ////debugger
      console.log("tockens     --------   " + tockens)
      console.log(tockens);
      const {refresh, success, access} = tockens;
  
      if (!success || !access || !refresh || !tockens.user)
        return false;
  
  
      User._Name = tockens.user.name;
      User._Nickname = tockens.user.nickname;
      User._ID = tockens.user.id;
      User._Email = tockens.user.email;
      User._Image = tockens.user.image;
      User._ConfirmEmail = true;
      User._SignIn = true;
      User._Gamemode = tockens.user.gamemode || "Easy";
      User._Twofactor = tockens.user.twofactor || false;

      localStorage.setItem("id", User._ID + "")
      localStorage.setItem("access", access + "")
      localStorage.setItem("refresh", refresh + "")
      return true;
    },

    setAccsessTockenLoading(data){
      localStorage.setItem("access", data.access + "")
      localStorage.setItem("refresh", data.refresh + "")
    },

    setAccsessTocken(data){
      localStorage.setItem("access", data.access.access_token + "")
      localStorage.setItem("refresh", data.access.access_token + "")
      localStorage.setItem("id",  data.user.id + "")
    },
    
    async longOut() {
      //debugger
      // api/v1/logout/
      const dbUser = {
        "pk": User._Id
      }
      const res = await FetchRequest("POST", "api/v1/logout", dbUser);
  
      localStorage.removeItem("id");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      

      User.Destruc();
      window.location.search = ""
    },
    
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
  }
  
  