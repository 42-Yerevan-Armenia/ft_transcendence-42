// Define the Client constructor function
function Client() {
    this.id = 0;
    this.name = "";
    this.type = "";
    this.email = "";
    this.password = "";
    this.confirmEmailCode = "";
    this.confirmEmailCodeTime = 0;
    this.confirmEmail = false;
    this.obj = {
        status: false,
        message: "Error default"
    };
}

// Export the Client constructor function
var ClientUser;

export function clearObject(){
    ClientUser = new Client();
}

export { Client , ClientUser};
