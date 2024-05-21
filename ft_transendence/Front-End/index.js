const express = require("express");
const path = require("path");

const app = express();


console.log("1__dirname  == " + __dirname);

// Serve static files from various directories
app.use(express.static(path.join(__dirname, "/")));
app.use(express.static(path.join(__dirname, "/Start")));
app.use(express.static(path.join(__dirname, "/Start/src/app")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models")));
app.use(express.static(path.join(__dirname, "/Start/src/app/styles")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models/Home")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models/Home/public")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models/Home/game")));




// Handle specific routes first
app.get("/", (req, res) => {
    console.log("/     ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/login", (req, res) => {
    console.log("/login     ["  + req.url + "]")
    
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});



// Handle specific routes first
app.get("/login/", (req, res) => {
    console.log("/login/     ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/register", (req, res) => {
    console.log("/register     ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/register/", (req, res) => {
    console.log("/register/     ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/confirm", (req, res) => {
    console.log("/confirm    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/confirm/", (req, res) => {
    console.log("/confirm/    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/register", (req, res) => {
    console.log("/register    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/register/", (req, res) => {
    console.log("/register/    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/reset", (req, res) => {
    console.log("/reset    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/reset/", (req, res) => {
    console.log("/reset/    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/setdata", (req, res) => {
    console.log("/setdata    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle all other routes with a wildcard
app.get("/setdata/", (req, res) => {
    console.log("/setdata/    ["  + req.url + "]")
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle all other routes with a wildcard
app.get("*", (req, res) => {
    console.log("*    ["  + req.url + "]")
    res.status(404).send("404 - Page Not Found");
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
