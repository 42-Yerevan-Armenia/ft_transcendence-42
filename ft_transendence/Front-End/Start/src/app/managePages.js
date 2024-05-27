var Pong = Object.assign({}, Game);
var local_game = new localGame();
var User = new USER();
var Confirm = new ConfirmPage();
var Login = new LoginPage();
var Register = new RegisterPage();
var Reset = new ResetPageA();
var Home = new HomePage();
var Password = new PasswordPage();
var SignUp = new SignupPage();
var ErrornotPage = new ErrorPage();
var get42Conf = new get42Config();

var ManageAllPage = {
    Manage: async function(pageName) {
      await  ManageAllPage.pages.forEach(async (element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === pageName) {
                // debugger
                obj.DisplayBlock();
                await obj.draw();
            }
            else
                await obj.DisplayNone();
        });
    },
    pages: [
        {"Login": Login},                                             //http://10.12.11.1:3000/login
        {"Confirm": Confirm},                                         //http://10.12.11.1:3000/confirm
        {"Register": Register},                                       //http://10.12.11.1:3000/register
        {"Home": Home},                                               //http://10.12.11.1:3000/password
        {"Password": Password},                                       //http://10.12.11.1:3000/pass
        {"SignUp": SignUp},                                           //http://10.12.11.1:3000/setdata
        {"ResetPage": Reset},                                         //http://10.12.11.1:3000/password
        {"local_game": local_game}            //http://10.12.11.1:3000/local_game_front
    ]
};

//manage Home Page in middle sections
//give name section name what we need show in middle Home->Midl section
var ManageMidle = {
    Manage: async function(midleName) {
       await ManageMidle.pages.forEach(async (element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element
            if (key === midleName) {
                obj.DisplayBlock();
                await obj.draw();
            }
            else
                obj.DisplayNone();
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
        await ManageRight.pages.forEach(async (element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === name) {
                obj.DisplayBlock();
                await obj.draw();
            }
            else
                obj.DisplayNone();
        });
    },
    pages: [
        {"right": Home._HomeRight},
        {"Message": Home._HomeMessage}
    ]
}
