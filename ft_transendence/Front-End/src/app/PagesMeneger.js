debugger
// create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		path: "/error.html",
		title: "404",
		description: "Page not found Error",
	},
	"/signin": {
		url: "/signin",
		class:".LoginPage",
		path: "/signin/signin.html",
		title: "Login",
		description: "This is the SignIn page",
	},
	"/signin/": {
		url: "/signin",
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

};
let pageIndex = 0
function StatePage (){
	this.page = pageIndex
}
// Stack to store navigation history
// {page:1, title: "Home", href: document.location.href,path :document.location.pathname}
var navigationHistoryA = [];
// when in document click anyone <a> tag that watches the nav links only
const links = document.querySelectorAll("a");

async function NavigateHistoryALLITEM(pathname, href, isATag){
	debugger
	let index = -1;
	//get the index from the page of the already existing one
	index = isInNavigationStack(pathname);
	if (navigationHistoryA.length > 1 &&  index != -1)
			changStack(navigationHistoryA.length, index);
		else
        	urlRoute(pathname, href);
	await urlLocationHandler(isATag);
}

links.forEach(link => {
	//set event listener in each a tag
    link.addEventListener("click", async (event) => {
		debugger
		console.log(window.history)

        event.preventDefault();
		try {
			await NavigateHistoryALLITEM(event.target.pathname, event.target.href, true);
		}
		catch(e){
			console.log("PagesMeneger tag error" + e);
		}
    });
});

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = (pathname, href) => {
	debugger
	// event = event || window.event; // get window.event if event argument not provided
	// event.preventDefault();
	// Url  = event.target.pathname;
	Url  = pathname;
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];
	// window.history.pushState(state, unused, target link);
	let statePage = new StatePage();
	statePage.page = ++pageIndex;
	window.history.pushState(statePage, route.title, href);
	// window.history.pushState(statePage, route.title, window.location.href);
	navigationHistoryA.push({statePage, title:route.title, href:href, path: pathname});
};

//change page and draw in screen
async function drawHtmlScreen(route, isATag){
	if (isATag)
		await ManageAllPage.Manage(route.title)
	// if (route.title !== "404" || route.title !== "Home")
	// {
	// 	const html = await fetch(route.path).then((response) => response.text());
	// 	if (!html)
	// 		document.querySelector(route.class).innerHTML = html;
	// }
	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	const meta = document.querySelector('meta[name="description"]');
	// set the content of the content div to the html
	meta.setAttribute("content", route.description);
}

// create a function that handles the url location
const urlLocationHandler =  async (isATag) => {
	debugger
	const Url = window.location.pathname; // get the url path
	console.log("window.location.pathname == " + window.location.pathname);

	if (typeof(Url) !== "string")
	{
		let x = Url.pathname;
		Url = x;
	}
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];
	// set the content of the content div to the html
	//redirect and Draw html screen
	await drawHtmlScreen(route, isATag);
};

// Function to check if a state is in the navigation stack
function  isInNavigationStack(path) {
	debugger
    // const index =  navigationHistoryA?.findLastIndex((element) => element.path == path)
	const index =  navigationHistoryA?.findIndex((element) => element.path == path)
	return index;
}

//change stack navigationHistoryA
function changStack(n, index) {
	debugger
	let currentTop = navigationHistoryA[n - 1];
	let newTop =  navigationHistoryA[index];

	navigationHistoryA[n - 1] = newTop;
	navigationHistoryA[index] = currentTop;
	// Replace the current state in the history
	window.history.replaceState(newTop.statePage, newTop.title, newTop.path);
	// window.history.go(navigationHistoryA[n - 1].page)
	// window.location.pathname = navigationHistoryA[n - 1].href;
}

//function  back()  and   forward()
const urlLocationHandlerForNavigateBackForward = async () => {
	debugger
	const Url =  window.location.pathname; // get the url path
	if (typeof(Url) !== "string") {
		let x = Url.pathname;
		Url = x;
	}
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];
	let LengthStack = navigationHistoryA.length;
	//check when Home Page
	if (LengthStack < 2)// || (navigationHistoryA[LengthStack - 1].title == route.title))
		return;
	let index = isInNavigationStack(window.location.pathname);
	if (navigationHistoryA[LengthStack - 1].statePage.page > navigationHistoryA[index].statePage.page) {
		// history.back();
		changStack(LengthStack, index)
		// window.location.pathname = route.url;
	}
	else {
		// history.forward();
		changStack(LengthStack, index);
		// window.location.pathname = route.url;
	}

	await drawHtmlScreen(route, true)
};

//add an event listener to the window that watches for url changes
window.addEventListener("popstate", async function(event) {
	debugger
    console.log("History state changed:", event.state);

	await urlLocationHandlerForNavigateBackForward();
});

// create a function that watches the url and calls the urlLocationHandler
const urlRouteForward = () => {
	debugger
	let statePage = new StatePage();

		// window.history.pushState({page:1}, "Home", document.location.href);
		// navigationHistory.push({page:1, title: "Home", href: document.location.href, path:window.location.pathname});


	window.history.pushState(statePage, "Home",document.location.href);
	navigationHistoryA.push({
		statePage,
		title: "Home",
		href: document.location.href, path:window.location.pathname
	});
};

urlRouteForward();



















// // Stack to store navigation history
// // {page:1, title: "Home", href: document.location.href,path :document.location.pathname}
// var navigationHistory = [];
// // debugger
// // create document click that watches the nav links only
// const links = document.querySelectorAll("a");

// links.forEach(link => {
//     link.addEventListener("click", (e) => {
//         // //debugger
// 		console.log(window.history)
//         const { target } = e;

//         e.preventDefault();
//         urlRoute(e);
//     });
// });


// // create an object that maps the url to the template, title, and description
// const urlRoutes = {
// 	404: {
// 		path: "/error.html",
// 		title: "404",
// 		description: "Page not found Error",
// 	},
// 	"/signin": {
// 		url: "/signin",
// 		class:".LoginPage",
// 		path: "/signin/signin.html",
// 		title: "Login",
// 		description: "This is the SignIn page",
// 	},
// 	"/signin/": {
// 		url: "/signin",
// 		class:".LoginPage",
// 		path: "/signin/signin.html",
// 		title: "Login",
// 		description: "This is the SignIn page",
// 	},
// 	"/register": {
// 		url: "/register",
// 		class:".RegisterPage",
// 		path: "/signup/signup.html",
// 		title: "Register",
// 		description: "This is the SignIn page",
// 	},
// 	"/register/": {
// 		url: "/register",
// 		class:".RegisterPage",
// 		path: "/signup/signup.html",
// 		title: "Register",
// 		description: "This is the SignIn page",
// 	},
// 	"/index.html": {
// 		url: "/",
// 		path: "/index.html",
// 		title: "Home",
// 		description: "This is the ft_transcendence page",
// 	},
// 	"/": {
// 		url: "/",
// 		path: "/index.html",
// 		title: "Home",
// 		description: "This is the ft_transcendence page",
// 	},
// 	"/confirm": {
// 		url: "/confirm",
// 		class:".ConfirmPage",
// 		path: "/signup/signup.html",
// 		title: "Confirm",
// 		description: "This is the Confirm page",
// 	},
// 	"/confirm/": {
// 		url: "/confirm",
// 		class:".ConfirmPage",
// 		path: "/signup/signup.html",
// 		title: "Confirm",
// 		description: "This is the Confirm page",
// 	},
// 	"/password": {
// 		url: "/password",
// 		class:".PasswordPage",
// 		path: "/signup/signup.html",
// 		title: "Password",
// 		description: "This is the Password page",
// 	},
// 	"/password/": {
// 		url: "/password",
// 		class:".PasswordPage",
// 		path: "/signup/signup.html",
// 		title: "Password",
// 		description: "This is the Password page",
// 	},
// 	"/reset": {
// 		url: "/reset",
// 		class:".ResetPage",
// 		path: "/signup/signup.html",
// 		title: "ResetPage",
// 		description: "This is the Reset page",
// 	},
// 	"/reset/": {
// 		url: "/reset",
// 		class:".ResetPage",
// 		path: "/signup/signup.html",
// 		title: "ResetPage",
// 		description: "This is the Reset page",
// 	},
// 	"/setdata": {
// 		url: "/setdata",
// 		class:".SignupPage",
// 		path: "/signup/signup.html",
// 		title: "SignUp",
// 		description: "This is the SignIn page",
// 	},
// 	"/setdata/": {
// 		url: "/setdata",
// 		class:".SignupPage",
// 		path: "/signup/signup.html",
// 		title: "SignUp",
// 		description: "This is the SignIn page",
// 	},
	
// };
// let i = 1;

// // create a function that watches the url and calls the urlLocationHandler
// const urlRoute = (event) => {
// 	// //debugger
// 	event = event || window.event; // get window.event if event argument not provided
// 	event.preventDefault();
	
// 	Url  = event.target.pathname;
	
// 	// get the route object from the urlRoutes object
// 	const route = urlRoutes[Url] || urlRoutes["404"];
	
// 	// window.history.pushState(state, unused, target link);
// 	window.history.pushState({page:++i}, route.title, event.target.href);
// 	navigationHistory.push({page:i, title:route.title, href:event.target.href, path: window.location.pathname});
// 	urlLocationHandler();
// };




// // create a function that handles the url location
// const urlLocationHandler = async () => {
// 	//debugger
// 	const Url = window.location.pathname; // get the url path
// 		console.log("window.location.pathname == " + window.location.pathname);
// 	if (typeof(Url) !== "string")
// 	{
// 		let x = Url.pathname;
// 		Url = x;
// 	}
// 	// get the route object from the urlRoutes object
// 	const route = urlRoutes[Url] || urlRoutes["404"];

// 	// set the content of the content div to the html
// 	ManageAllPage.Manage(route.title)

// 	if (route.title !== "404" || route.title !== "Home")
// 	{
// 		const html = await fetch(route.path).then((response) => response.text());
// 		if (!html)
// 			document.querySelector(route.class).innerHTML = html;
// 	}

// 	console.log("route.title == " + route.title)
// 	// set the title of the document to the title of the route
// 	document.title = route.title;

// 	// set the description of the document to the description of the route
// 	const meta = await document.querySelector('meta[name="description"]');

// 	await meta.setAttribute("content", route.description);
// };




// // Function to check if a state is in the navigation stack
// async function  isInNavigationStack(path) {
//     const index = await navigationHistory.findLastIndex((element) => element.path == path)
// 	return index;
// }



// function changStack(n, index){
// 	let currentTop = navigationHistory[n - 1];
// 	let newTop =  navigationHistory[index];

// 	navigationHistory[n - 1] = newTop;
// 	navigationHistory[index] = currentTop;
// }

// //function  back()  and   forward()
// const urlLocationHandlerForNavigateBackForward = async () => {
// 	//debugger
// 	const Url =  await window.location.pathname; // get the url path
		
// 	if (typeof(Url) !== "string")
// 	{
// 		let x = Url.pathname;
// 		Url = x;
// 	}
// 	// get the route object from the urlRoutes object
// 	const route = urlRoutes[Url] || urlRoutes["404"];
// 	let item = navigationHistory.length;

// 	//check when Home Page
// 	if (item < 2)// || (navigationHistory[item - 1].title == route.title))
// 		return;
// 	let index = await isInNavigationStack(window.location.pathname);
// 	if (navigationHistory[item - 1].page > navigationHistory[index].page)
// 	{
// 		// history.back();
// 		await changStack(item, index)
// 		// window.location.pathname = route.url;
// 	}
// 	else
// 	{
// 		// history.forward();
// 		await changStack(item, index);
// 		// window.location.pathname = route.url;
// 	}
// 	// set the content of the content div to the html
// 	await ManageAllPage.Manage(route.title)
// 	if (route.title !== "404" && route.title !== "Home")
// 	{
		
// 		const html = await fetch(route.path).then((response) => response.text());
// 		if (!html)
// 		{
// 			document.querySelector(route.class).innerHTML = "<h1> PAGE Empty<h1>";
// 		}
// 	}
// 	else if (route.title !== "404")
// 	{
		
// 	}
// 	console.log("route.title == " + route.title)
// 	// set the title of the document to the title of the route
// 	document.title = route.title;

// 	// set the description of the document to the description of the route
// 	const meta = document.querySelector('meta[name="description"]');

// 	meta.setAttribute("content", route.description);
// };

// // // add an event listener to the window that watches for url changes
// window.addEventListener("popstate", async function(event) {
// 	//debugger
//     console.log("History state changed:", event.state);

// 	await urlLocationHandlerForNavigateBackForward();
// });


// // create a function that watches the url and calls the urlLocationHandler
// const urlRouteForward = () => {
// 	// window.history.pushState(state, unused, target link);
// 	window.history.pushState({page:1}, "Home", document.location.href);
// 	navigationHistory.push({page:1, title: "Home", href: document.location.href, path:window.location.pathname});
// };

// urlRouteForward();

// // window.addEventListener("click",(e)=>{
// // 	e.preventDefault();
// // 	console.log("1 DOMContentLoaded   + " + e.target);
// // 	console.log("2 DOMContentLoaded   + " + location.pathname);
// // })




