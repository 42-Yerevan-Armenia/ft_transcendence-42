/*
function handleMainLoad(User) {
    //console.log("Main element is loaded");

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
    //console.log("Main element not found");
}
"dev": "npx http-server . -p 3000"
*/
document.addEventListener("DOMContentLoaded", async () => {
    // debugger
    //console.log(" //console.log(window.history);")

    //console.log(window.location.href);
    
    if(User.checkSignIn()) {
        //once expiration a new refresh token is generated
        //set data from backend
        if (await User.menegAccsess()) {
            if (await User.setDataFromBackEnd())
            {
                //console.log("true +++++++++++++++++  " + window.location.href);
                const href = window.location.href;
                NavigateHistoryALLITEM(window.location.pathname, href, "true");
                return ;
            }
            else
                await myStorages.longOut();
        }
        else
            await myStorages.longOut();
    }
    else {
        // ////// debugger
        const code = window.location.search?.slice(6);
        if (code)
        {
            User.url42schools = code;
            await Login.Post42ConnectBackend();
        }
    }

    urlRouteForward();
});

