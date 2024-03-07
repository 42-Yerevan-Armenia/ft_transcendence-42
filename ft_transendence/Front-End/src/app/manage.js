const ManageAllPage = {
    Manage: function(pageName) {
        ManageAllPage.pages.forEach((element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element

            if (key === pageName) {
                obj.DisplayBlock();
            } else {
                obj.DisplayNone();
            }
        });
    },
    pages: [
        {"Confirm": Confirm},
        {"Login": Login},
        {"Register": Register},
        {"Home": Home},
        {"Password": Password},
        {"SignUp": SignUp}
    ]
};



const ManageMidle = {
    Manage: function(midleName) {
        console.log("midleName = [" + midleName + "]")
        ManageMidle.pages.forEach((element) => {
            const [key, obj] = Object.entries(element)[0]; // Get the key-value pair of the element
            console.log("key = [" + key  +  "obj " + obj + "]")
            if (key === midleName) {
                obj.DisplayBlock();
                obj.func();
            } else {
                obj.DisplayNone();
            }
        });
    },
    pages: [
        {"MidleCub": Home._MidleCub},
        {"MidleSettings": Home._MiddleSettings},
        {"midle": Home._Midle}
        // {"MidleCub": MidleCubx},
        // {"Password": Password},
        // {"SignUp": SignUp}
    ]
};
