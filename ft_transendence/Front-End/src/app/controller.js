"use script"
// const HostPort="http://localhost:5001"
// const HostPort="http://10.12.11.1:8000"
const HostPort="http://10.12.11.2:8000"



// hovhannes_vardanyan1@mail.ru



//#################################################################################   Controller.js

//queshon too backend Email exist or not and 
//if create 
async function ControllerCheckEmail(email) {
  try {
    // const response = await fetch(`${HostPort}/registerpage?email=${email}`,{
    const response = await fetch(`${HostPort}/email_validation/`,{
      method: 'POST',
      body: JSON.stringify({email:email}),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok)
    {
      throw new  Error("Error: Whene Email check status " + response.status)
    }
    const result = await response.json();

    if (!result || typeof result !== 'object') {
      throw new Error("Invalid response data");
    }
    return {state:true, message: result.message};
  }
  catch(err) {
    let error;
    if (err)
      error = err  + "";
    else
      error = "Error: Server";
    return {state:false, "message": error};
  }
}
// headers: { 
//   'Content-Type': 'application/json',
//   'AuthToken': '123456'
//  } // Fixed 'header' to 'headers'
// });

async function ControllerCheckReplayCode(code) {
  debugger
  console.log("code" + code);
  try {
      const response = await fetch(`${HostPort}/confirm/`, {
          method: 'POST',
          body: JSON.stringify({ code: code }), // Assuming you want to send the code as JSON
          headers: { 
            'Content-Type': 'application/json'
           }
      });
      if (!response.ok)
        throw new Error(response.statusText  + " " + response.status);

      const data = await response.json(); // Await the parsing of JSON data

      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response data");
      }

      return{state:true, "message": data };
  }
  catch (err) {
    
    const error = err + "";
    
    console.log("error   === [" + error + "]")
    
    return {state:false, "message": error};
  }
}

async function ControllerSignUp(password, User) {
  console.log("ControllerSignUp");
  try {
    const response = await fetch(`${HostPort}/register/`, {
      method: 'POST',
      body: JSON.stringify({ name: User._name, password: password, nickname: User._nickname}),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to update password. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error("Invalid response data");
    }
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}

async function ControllerPessPassword(password, User) {
  console.log("ControllerPessPassword");
  try {
    const response = await fetch(`${HostPort}/password`, {
      method: 'POST',
      body: JSON.stringify({ code: password, email: User._Email }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to update password. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error("Invalid response data");
    }
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}


//fetch universal
async function FetchRequest(Tomethod, Torequest, ToObj) {
  console.log("1----------------------------------------")
  console.log( "method : " + Tomethod);
  console.log( "request : " + Torequest);
  console.log( ToObj);
  console.log("2----------------------------------------")
  try {
    const response = await fetch(`${HostPort}/${Torequest}/`, {
      method: Tomethod,
      body: JSON.stringify(ToObj),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to ${response.message} Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error("Invalid response data");
    }

    console.log("ControllerPessPassword  Succsse++++++++++++++++++++");
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}