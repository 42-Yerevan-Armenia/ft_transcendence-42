//hovhannes_vardanyan1@mail.ru
//Hovo@1234
//-------------------------------------------------       browser storage     ----------------------------------------

//manag browser storage
const myStorages = {
    setStorageLogin(tockens) {
      debugger
      console.log("tockens     --------   " + tockens)
      console.log(tockens);
      const {user} = tockens;
      console.log(user)
      const {refresh, success, access} = tockens;
  
      if (!success || !access || !refresh || !tockens.user)
        return false;
  
  
      User._Name = tockens.user.name;
      User._Nickname = tockens.user.nickname;
      User._ID = tockens.user.id;
      User._Email = tockens.user.email;
      User._Image = tockens.user.image;
  
      console.log("User._Imag = " + User._Image);
      localStorage.setItem("id", User._ID + "")
      localStorage.setItem("access", access + "")
      localStorage.setItem("refresh", refresh + "")
      return true;
    },

    //set access and refresh token in to localStorage
    setAccessRefreshToStorage(tockens){
      const {user} = tockens;
      console.log(user)
  
      const {refresh, success, access} = tockens;
      if (!success || !access || !refresh || !tockens.user)
      return false;
  
      localStorage.setItem("access", access + "")
      localStorage.setItem("refresh", refresh + "")
    },
  
    longOut() {
      debugger
      localStorage.removeItem("id");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      User.Destruc();
      console.log("Home._HomeLeft._LongOut.addEventListener");
    }
  }
  
  