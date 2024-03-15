/*
function handleMainLoad(User) {
    console.log("Main element is loaded");

        const getAccess = localStorage.getItem("access_token");
        const geRefresh = localStorage.getItem("refresh_token");
        if (getAccess && geRefresh)
            User._SignIn = true;
        else
            User._SignIn = false;
        return User._SignIn;
}
  
// Select the main element
const mainElement = document.querySelector("main");

// Check if the main element exists
if (mainElement) {

    // If it exists, create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        if (document.contains(mainElement)) {// Check if the main element is in the DOM
        // If it's in the DOM, disconnect the observer and trigger the handling function
        observer.disconnect();
        handleMainLoad(User);
        }
    });

    // Start observing changes in the DOM, including when the main element is added
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    console.log("Main element not found");
}
*/





document.addEventListener("DOMContentLoaded", async () => {
    console.log("1-- Document is loaded");

    debugger
    if(User.checkSignIn())
    {
        console.log("2-- Document is loaded");
       const res = await User.accessRefresh();
       if (res)
       {
        console.log("true")
       }
    }
    ManageAllPage.Manage("Home");
});




