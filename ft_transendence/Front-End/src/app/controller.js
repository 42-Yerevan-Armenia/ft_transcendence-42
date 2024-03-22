"use strict"
// const HostPort="http://localhost:5001"
const HostPort="http://10.12.11.1:8000"
// const HostPort="http://10.12.11.2:8000"



// hovhannes_vardanyan1@mail.ru



//#################################################################################   Controller.js

//queshon too backend Email exist or not and 
//if create 
async function ControllerCheckEmail(email) {
  debugger
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
    console.log( "Succsse++++++++++++++++++++    222222")
    console.log( "method : " + "POST");
    console.log( "request : " + "email_validation");
    console.log(result);
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
          body: JSON.stringify({ code: code, email: User._Email }), // Assuming you want to send the code as JSON
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

      console.log( "Succsse++++++++++++++++++++    222222")
      console.log( "method : " + "POST");
      console.log( "request : " + "confirm");
      console.log(data);
      return{state:true, "message": data };
  }
  catch (err) {
    
    const error = err + "";
    
    console.log("error   === [" + error + "]")
    
    return {state:false, "message": error};
  }
}

async function ControllerSignUp(password, User) {
  debugger
  console.log("ControllerSignUp");
  try {
    const response = await fetch(`${HostPort}/register/`, {
      method: 'POST',
      body: JSON.stringify({ name: User._Name, password: password, nickname: User._Nickname}),
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
    console.log( "Succsse++++++++++++++++++++    222222")
    console.log( "method : " + "POST");
    console.log( "request : " + "register");
    console.log(data);
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}

async function ControllerPessPassword(password, User) {
  debugger
  console.log("----------password = [" + password +"] email ["+ User._Email + "]");
  console.log(User)

  try {
    const response = await fetch(`${HostPort}/password/`, {
      method: 'POST',
      body: JSON.stringify({ password: password, email: User._Email }),
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
    console.log( "Succsse++++++++++++++++++++    11111")
    console.log( "method : " + "POST");
    console.log( "request : " + "password");
    console.log(data);

    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}


//fetch universal POST request
async function FetchRequest(Tomethod, Torequest, ToObj) {
  debugger
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
    console.log( "method : " + Tomethod);
    console.log( "request : " + Torequest);
    console.log("ControllerPessPassword  Succsse++++++++++++++++++++");
    console.log(data);
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}



//fetch universal  GET request
async function getFetchRequest(ToRequest) {
  debugger
  console.log("1----------------------GET------------------")

  console.log( "request : " + ToRequest);

  //get access tocken and id
  const ToObj = User.getAccessTocken();

  if (!ToObj || ToObj.access)
    return null;
  console.log("2---------------------GET-------------------")
  try {
    const response = await fetch(`${HostPort}/${ToRequest}/`, {
      method: "GET",
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
    console.log(data);
    return { state: true, message: data };
  } catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
