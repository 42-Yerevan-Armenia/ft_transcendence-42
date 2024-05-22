// create an object that maps the url to the template, title, and description
const urlRoutes = {
	"404": {
		path: "/error.html",
		title: "404",
		description: "Page not found Error",
	},
	"/login": {
		url: "/login",
		class:".LoginPage",
		path: "/signin/signin.html",
		title: "Login",
		description: "This is the SignIn page",
	},
	"/login/": {
		url: "/login",
		class:".LoginPage",
		path: "/signin/signin.html",
		title: "Login",
		description: "This is the SignIn page",
	},
	"/register": {
		url: "/register",
		class:".RegisterPage",
		path: "/signup/signup.html",
		title: "Register",
		description: "This is the SignIn page",
	},
	"/register/": {
		url: "/register",
		class:".RegisterPage",
		path: "/signup/signup.html",
		title: "Register",
		description: "This is the SignIn page",
	},
	"/index.html": {
		url: "/",
		path: "/index.html",
		title: "Home",
		description: "This is the ft_transcendence page",
	},
	"/": {
		url: "/",
		path: "/index.html",
		title: "Home",
		description: "This is the ft_transcendence page",
	},
	"/confirm": {
		url: "/confirm",
		class:".ConfirmPage",
		path: "/signup/signup.html",
		title: "Confirm",
		description: "This is the Confirm page",
	},
	"/confirm/": {
		url: "/confirm",
		class:".ConfirmPage",
		path: "/signup/signup.html",
		title: "Confirm",
		description: "This is the Confirm page",
	},
	"/password": {
		url: "/password",
		class:".PasswordPage",
		path: "/signup/signup.html",
		title: "Password",
		description: "This is the Password page",
	},
	"/password/": {
		url: "/password",
		class:".PasswordPage",
		path: "/signup/signup.html",
		title: "Password",
		description: "This is the Password page",
	},
	"/reset": {
		url: "/reset",
		class:".ResetPage",
		path: "/signup/signup.html",
		title: "ResetPage",
		description: "This is the Reset page",
	},
	"/reset/": {
		url: "/reset",
		class:".ResetPage",
		path: "/signup/signup.html",
		title: "ResetPage",
		description: "This is the Reset page",
	},
	"/setdata": {
		url: "/setdata",
		class:".SignupPage",
		path: "/signup/signup.html",
		title: "SignUp",
		description: "This is the SignIn page",
	},
	"/setdata/": {
		url: "/setdata",
		class:".SignupPage",
		path: "/signup/signup.html",
		title: "SignUp",
		description: "This is the SignIn page",
	},
	"/midle/": {
		midle:true,
		url: "/midle",
		class:".midle",
		path: "/LEFTHOME",
		title: "midle",
		description: "This is the midle section",
	},
	"/midle": {
		midle:true,
		url: "/midle",
		class:".midle",
		path: "/LEFTHOME",
		title: "midle",
		description: "This is the midle section",
	},
	"/profil/": {
		midle:true,
		url: "/profil",
		class:".PROFIL",
		path: "/profil",
		title: "ProfileMidle",
		description: "This is the profil section",
	},
	"/profil": {
		midle:true,
		url: "/",
		class:".PROFIL",
		path: "/profil",
		title: "ProfileMidle",
		description: "This is the profil section",
	}
};
