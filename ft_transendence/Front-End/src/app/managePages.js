var User = new USER();
var Confirm = new ConfirmPage();
var Login = new LoginPage();
var Register = new RegisterPage();
var Reset = new ResetPageA();
var Home = new HomePage();
var Password = new PasswordPage();
var SignUp = new SignupPage();





var ManageAllPage = {
    Manage: async function(pageName) {
        ////debugger
      await  ManageAllPage.pages.forEach(async (element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === pageName) {
                obj.DisplayBlock();
                await obj.draw();
            } else {
                await obj.DisplayNone();
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
    Manage: async function(midleName) {
         ////debugger
       await ManageMidle.pages.forEach(async (element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element
            if (key === midleName) {
                obj.DisplayBlock();
                await obj.draw();
            } else {
                obj.DisplayNone();
            }
        });
    },
    pages: [
        {"MidleCub": Home._MidleCub},
        {"MidleSettings": Home._MiddleSettings},
        {"midle": Home._Midle},
        {"JoinList": Home._MidleJoinList},
        {"ProfileMidle":Home._HomeMidleProfile},
        {"MidleHistoryGame": Home._MidleHistoryGame},
        {"JoinListInvite": Home._MidleJoinList._JoinListInvit},
        {"MidleCommunity": Home._MidleCommunity},
        {"AccountUser": Home._AccountUser}
    ]
};


var ManageRight = {
    Manage: async function(name) {
        ////debugger
        await ManageRight.pages.forEach(async (element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === name) {
                obj.DisplayBlock();
                await obj.draw();
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



