////debugger

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
	// let index = -1;

	//get the index from the page of the already existing one
	if (href.slice(0,4) != "http")
		href = window.location.protocol + "//" + href;
	
	// index = isInNavigationStack(pathname);
	// if (navigationHistoryA.length > 1 &&  index != -1)
	// 		changStack(navigationHistoryA.length, index);
	// 	else

		addNewUrlRoute(pathname, href);
	await urlLocationHandler(isATag, pathname, href);
}

links.forEach(link => {
	//set event listener in each <a href="Home or other" > </a> tag
    link.addEventListener("click", async (event) => {
        event.preventDefault();
		// //debugger
		try {
			await NavigateHistoryALLITEM(event.target.pathname, event.target.href, true);
		}
		catch(e){
			console.log("PagesMeneger tag error+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=" + e);
		}
    });
});

// create a function that watches the url and calls the urlLocationHandler
const addNewUrlRoute = (pathname, href) => {
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
	if (href.slice(0,4) != "http")
		href = window.location.protocol + "//" + href;
	window.history.pushState(statePage, route.title, href);
	// window.history.pushState(statePage, route.title, window.location.href);
	navigationHistoryA.push({statePage, title:route.title, href:href, path: pathname});
};

//change page and draw in screen
async function drawHtmlScreen(route, isATag){

	if (isATag)
		await ManageAllPage.Manage(route.title)

	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	const meta = document.querySelector('meta[name="description"]');
	// set the content of the content div to the html
	meta.setAttribute("content", route.description);
}

// create a function that handles the url location
const urlLocationHandler =  async (isATag, pathname, href) => {
	debugger
	const Url = pathname; //window.location.pathname; // get the url path
	console.log("window.location.pathname == " + window.location.pathname + "    pathname   " + pathname);
	console.log(window.state)
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
		//at the moment we are doing it go back    <-
		// history.back();
		// window.location.pathname = route.url;
		changStack(LengthStack, index)
	}
	else {
		//at the moment we are doing it go forward ->
		// window.location.pathname = route.url;
		// history.forward();
		changStack(LengthStack, index);
	}
	await drawHtmlScreen(route, true)
};

//add an event listener to the window that watches for url changes "-> or <-"
window.addEventListener("popstate", async function(event) {
	debugger
    console.log("History state changed:", event.state);

	await urlLocationHandlerForNavigateBackForward();
});

// create a function that watches the url and calls the urlLocationHandler
const urlRouteForward = async () => {
	debugger
	let statePage = new StatePage();
	
	const href = document.location.href;

	const Url =  window.location.pathname; // get the url path
	if (typeof(Url) !== "string") {
		let x = Url.pathname;
		Url = x;
	}
	// get the route object from the urlRoutes object
	const route = urlRoutes[Url] || urlRoutes["404"];

	if (route.title == "404")
	{
		drawHtmlScreen(route, false);
		ErrornotPage.draw();
	}
	else
		await drawHtmlScreen(route, true);


	window.history.pushState(statePage, "Home", href);
	navigationHistoryA.push({
		statePage,
		title: "Home",
		href: document.location.href, path:window.location.pathname
	});
};

