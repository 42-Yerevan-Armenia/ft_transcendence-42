var User = new USER();
var Confirm = new ConfirmPage();
var Login = new LoginPage();
var Register = new RegisterPage();
var Reset = new ResetPageA();
var Home = new HomePage();
var Password = new PasswordPage();
var SignUp = new SignupPage();


var ManageAllPage = {
    Manage: function(pageName) {
        debugger
        ManageAllPage.pages.forEach((element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === pageName) {
                obj.DisplayBlock();
                obj.Drow();
            } else {
                obj.DisplayNone();
            }
        });
    },
    pages: [
        {"Login": Login},
        {"Confirm": Confirm},
        {"Register": Register},
        {"Home": Home},
        {"Password": Password},
        {"SignUp": SignUp},
        {"ResetPage": Reset}
    ]
};


//manage Home Page in middle sections
//give name section name what we need show in middle Home->Midl section
var ManageMidle = {
    Manage: function(midleName) {
         debugger
        console.log("midleName = [" + midleName + "]")
        ManageMidle.pages.forEach((element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element
            console.log("key = [" + key  +  "obj " + obj + "]")
            if (key === midleName) {
                obj.DisplayBlock();
                obj.Drow();
            } else {
                obj.DisplayNone();
            }
        });
    },
    pages: [
        {"MidleCub": Home._MidleCub},
        {"MidleSettings": Home._MiddleSettings},
        {"midle": Home._Midle},
        {"JoinList": Home._MidleJoinList}
        // {"Password": Password},
        // {"SignUp": SignUp}
    ]
};


var ManageRight = {
    Manage: function(name) {
        debugger
        ManageRight.pages.forEach((element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === name) {
                obj.DisplayBlock();
                obj.Drow();
            } else {
                obj.DisplayNone();
            }
        });
    },
    pages: [
        {"right": Home._HomeRight},
        {"Message": Home._HomeMessage}
    ]
}



