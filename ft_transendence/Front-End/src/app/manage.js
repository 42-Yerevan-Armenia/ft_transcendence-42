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
