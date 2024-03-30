function ValidateEmail(input) {
  debugger
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
  debugger
  // Regular expression to match strings with only characters
  // and starting with an uppercase letter
  const regex = /^[A-Z][a-z]*$/;

  // Test the string against the regular expression
  return regex.test(str);
}


//check if the password is correct
function PasswordisCorrect(obj, error){
  debugger
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
  debugger
  let hashCode = Array.from({length:10}, (i) =>Math.floor(Math.random() * 10)) + "";
  const sliceDelete = /,/g;
  const str = hashCode.replace(sliceDelete, '');
  return str;
}


function scrollToLastTag() {
  var container = document.getElementById('containerScroll');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
