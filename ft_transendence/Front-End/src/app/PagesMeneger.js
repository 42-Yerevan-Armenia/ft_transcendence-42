debugger

// Stack to store navigation history
// {page:1, title: "Home", href: document.location.href,path :document.location.pathname}
var navigationHistory = [];

// create document click that watches the nav links only
const links = document.querySelectorAll("a");

links.forEach(link => {
    link.addEventListener("click", (e) => {
        debugger
		console.log(window.history)
        const { target } = e;

        e.preventDefault();
        urlRoute(e);
    });
});

// create an object that maps the url to the template, title, and description
const urlRoutes = {
	404: {
		path: "/error/error.html",
		title: "404",
		description: "Page not found",
	},
	"/signin": {
		class:".LoginPage",
		path: "/signin/signin.html",
		title: "Login",
		description: "This is the SignIn page",
	},
	"/signup": {
		class:".ResetPage",
		path: "/signup/signup.html",
		title: "Register",
		description: "This is the SignIn page",
	},
	"/index.html": {
		path: "/index.html",
		title: "Home",
		description: "This is the ft_transcendence page",
	},
	"/": {
		path: "/index.html",
		title: "Home",
		description: "This is the ft_transcendence page",
	}
	// "/about": {
	// 	template: "/templates/about.html",
	// 	title: "About Us | " + urlPageTitle,
	// 	description: "This is the about page",
	// },
	// "/contact": {
	// 	template: "/templates/contact.html",
	// 	title: "Contact Us | " + urlPageTitle,
	// 	description: "This is the contact page",
	// },
};
let i = 1;

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = (event) => {
	debugger
	event = event || window.event; // get window.event if event argument not provided
	event.preventDefault();
	
	Url  = event.target.pathname;
	
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];
	
	// window.history.pushState(state, unused, target link);
	window.history.pushState({page:++i}, route.title, event.target.href);
	navigationHistory.push({page:i, title:route.title, href:event.target.href, path: window.location.pathname});
	urlLocationHandler();
};




// create a function that handles the url location
const urlLocationHandler = async () => {
	debugger
	const Url = window.location.pathname; // get the url path
		
	if (typeof(Url) !== "string")
	{
		let x = Url.pathname;
		Url = x;
	}
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];

	// set the content of the content div to the html
	ManageAllPage.Manage(route.title)

	if (route.title !== "404" || route.title !== "Home")
	{
		const html = await fetch(route.path).then((response) => response.text());
		document.querySelector(route.class).innerHTML = html;
	}

	// set the title of the document to the title of the route
	document.title = route.title;

	// set the description of the document to the description of the route
	const meta = document.querySelector('meta[name="description"]');

	meta.setAttribute("content", route.description);
};




// Function to check if a state is in the navigation stack
function isInNavigationStack(path) {
    const index = navigationHistory.findLastIndex((element) => element.path == path)
	return index;
}



function changStack(n, index){
	let currentTop = navigationHistory[n - 1];
	let newTop =  navigationHistory[index];

	navigationHistory[n - 1] = newTop;
	navigationHistory[index] = currentTop;
}


//function  back()  and   forward()
const urlLocationHandlerForNavigateBackForward = async () => {
	debugger
	const Url = window.location.pathname; // get the url path
		
	if (typeof(Url) !== "string")
	{
		let x = Url.pathname;
		Url = x;
	}
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];
	let item = navigationHistory.length;

	//check when Home Page
	if (item < 2 || (navigationHistory[item - 1].title == route.title))
		return;
	let index = isInNavigationStack(window.location.pathname);
	if ((item - 1 - index) == 1)
	{
		changStack(item, index)
		history.back();
	}
	else
	{
		changStack(item, index);
		history.forward();
	}
	// set the content of the content div to the html
	ManageAllPage.Manage(route.title)
	if (route.title !== "404" && route.title !== "Home")
	{
		const html = await fetch(route.path).then((response) => response.text());
		document.querySelector(route.class).innerHTML = html;
	}
	else if (route.title !== "404")
	{
		
	}

	// set the title of the document to the title of the route
	document.title = route.title;

	// set the description of the document to the description of the route
	const meta = document.querySelector('meta[name="description"]');

	meta.setAttribute("content", route.description);
};

// // add an event listener to the window that watches for url changes
window.addEventListener("popstate", function(event) {
	debugger
    console.log("History state changed:", event.state);

	urlLocationHandlerForNavigateBackForward();
});


// create a function that watches the url and calls the urlLocationHandler
const urlRouteForward = () => {
	// window.history.pushState(state, unused, target link);
	window.history.pushState({page:1}, "Home", document.location.href);
	navigationHistory.push({page:1, title: "Home", href: document.location.href,path:window.location.pathname});
};

urlRouteForward();