function ValidateEmail(input) {

  console.log("1input =[" + input  + "]");
  if (!input)
  {
    return "Invalid email address!";
  }
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (input.indexOf('.') == -1)
    return "Invalid email address!"
  if (input?.match(validRegex)) {
    return "Valid email address!";
  } else {
    return "Invalid email address!";
  }
}

function checkName(str) {
  // Regular expression to match strings with only characters
  // and starting with an uppercase letter
  const regex = /^[A-Z][a-z]*$/;

  // Test the string against the regular expression
  return regex.test(str);
}

function PasswordisCorrect(obj, error){
  if (obj.value.length < 8 || obj.value.length > 16)
  {
    error.innerHTML = "password must be 8 to 16 character";
    error.style.color = "red";
    return false;
  }
    // Define a regular expression to match the password criteria
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    
    // Test if the password matches the regular expression
  if (!passwordRegex.test(obj.value))
  {
    debugger
    error.innerHTML = "At least one lowercase letter , one uppercase letter, At least one digit";
    error.style.color = "red";
    return false;
  }
  return true;
}


function HashCodeGeneration(){
  let hashCode = Array.from({length:10}, (i) =>Math.floor(Math.random() * 10)) + "";
  const sliceDelete = /,/g;
  const str = hashCode.replace(sliceDelete, '');
  return str;
}


//-------------------------------------------------       browser storage     ----------------------------------------

//manag browser storage
const myStorages = {
  setStorage(tockens) {
    const {refresh, success, access} = tockens;

    if (!success || !access || !refresh)
      return false;

    console.log("setStorage  : true")
    localStorage.setItem("access", access + "")
    localStorage.setItem("refresh", refresh + "")
    return true;
  },
  setStorageLogin(tockens) {
    const {refresh, success, access} = tockens;

    if (!success || !access || !refresh || !tockens.user)
      return false;
  
    User._name = tockens.user.name;
    User._nickname = tockens.user.nickname;
    User._ID = tockens.user.id;
    User._Email = tockens.user.email;

    localStorage.setItem("access", access + "")
    localStorage.setItem("refresh", refresh + "")
    return true;
  },
  longOut() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    User.Destruc();
    ManageAllPage.Manage("Home");
    console.log("Home._HomeLeft._LongOut.addEventListener");
  },
  longOutGoLogin() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    User.Destruc();
  }
}

