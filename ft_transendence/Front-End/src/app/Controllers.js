"use strict"
// const HostPort="http://localhost:5001"
// const HostPort="http://10.12.11.1:8000"
const HostPort="http://10.12.11.2:8000"

let INTRA_API_URL="https://api.intra.42.fr/";
let INTRA_API_UID="u-s4t2ud-1cd616aa7279a41f3410720fbc7b56429f94114c40825b988cd2877c2070c236";
let INTRA_REDIRECT_URI="http%3A%2F%2F10.12.11.1%3A3000%2F";

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
      throw new  Error("Error: Whene Email check status " + response.status)
    const result = await response.json();

    if (!result || typeof result !== 'object')
      throw new Error("Invalid response data");
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
      if (!data || typeof data !== 'object')
        throw new Error("Invalid response data");
      return{state:true, "message": data };
  }
  catch (err) {
    const error = err + "";
    return {state:false, "message": error};
  }
}

async function ControllerSignUp(password, User) {
  try {
    const response = await fetch(`${HostPort}/register/`, {
      method: 'POST',
      body: JSON.stringify({ name: User._Name, password: password, nickname: User._Nickname,email: User._Email}),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok)
      throw new Error(`Failed to update password. Status: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object')
      throw new Error("Invalid response data");
    return { state: true, message: data };
  }
  catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
async function ControllerPessPassword(password, User) {
  try {
    const response = await fetch(`${HostPort}/password/`, {
      method: 'POST',
      body: JSON.stringify({ password: password, email: User._Email }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok)
      throw new Error(`Failed to update password. Status: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object')
      throw new Error("Invalid response data");
    return { state: true, message: data };
  } 
  catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
//fetch universal POST request ❌
async function FetchRequest(Tomethod, Torequest, ToObj) {
  // debugger
  try {
    const response = await fetch(`${HostPort}/${Torequest}/`, {
      method: Tomethod,
      body: JSON.stringify(ToObj),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok)
      throw new Error(`Failed to ${response.message} Status: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object')
      throw new Error("Invalid response data");
    return { state: true, message: data };
  }
  catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
//fetch universal  GET request ❌
async function getFetchRequest(ToRequest) {
  // debugger
  //get access tocken and id
  const ToObj = User.getAccessTocken();
  if (!ToObj || !ToObj.access)
    return null;
  const ToUser = ToObj.access;
  try {
    const response = await fetch(`${HostPort}/${ToRequest}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + ToUser
      }
    });
    if (!response.ok)
      throw new Error(`Failed to ${response.message} Status: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object')
      throw new Error("Invalid response data");
    return { state: true, message: data };
  }
  catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
// async function getFetchRequest(ToRequest) {
// debugger
//   try {
//     const response = await fetch(`${HostPort}/${ToRequest}/`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       }
//     });
//     if (!response.ok)
//       throw new Error(`Failed to fetch. Status: ${response.status}`);
//     const data = await response.json();
//     if (!data || typeof data !== 'object')
//       throw new Error("Invalid response data");
//     return { state: true, message: data };
//   }
//   catch (error) {
//     console.error("Error:", error);
//     return { state: false, message: error.message };
//   }
// }

//fetch universal POST request ❌
async function putRequest(Tomethod, Torequest, ToObj) {
  // debugger
  const token =  await User.getAccessTocken();
  try {
    const response = await fetch(`${HostPort}/${Torequest}/`, {
      method: Tomethod,
      body: JSON.stringify(ToObj),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token.access
      }
    });
    if (!response.ok)
      throw new Error(`Failed to ${response.message} Status: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object')
      throw new Error("Invalid response data");
    return { state: true, message: data };
  }
  catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
//fetch universal Get request prune ❌
async function getPureFetchRequest(Torequest) {
  // debugger
  try {
    const response = await fetch(`${HostPort}/${Torequest}/`)
    if (!response.ok)
      throw new Error(`Failed to ${response.message} Status: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object')
      throw new Error("Invalid response data");
    return { state: true, message: data };
  }
  catch (error) {
    console.error("Error:", error);
    return { state: false, message: error.message };
  }
}
