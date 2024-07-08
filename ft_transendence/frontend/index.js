const express = require("express");
const path = require("path");

const app = express();

// Redirect trailing slashes to non-slash counterparts
app.use((req, res, next) => {
    if (req.url.slice(-1) === '/' && req.url.length > 1) {
        const query = req.url.slice(0, -1) + req.url.slice(-1).replace(/\//g, '');
        res.redirect(301, query);
    } 
    else {
        next();
    }
});

// Serve static files from various directories
app.use(express.static(path.join(__dirname, "/")));
app.use(express.static(path.join(__dirname, "/Start")));
app.use(express.static(path.join(__dirname, "/Start/src/app")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models")));
app.use(express.static(path.join(__dirname, "/Start/src/app/styles")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models/Home")));
app.use(express.static(path.join(__dirname, "/Start/src/app/models/Home/public")));


// Handle specific routes first
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/register", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/confirm", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/register", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/reset", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/setdata", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/password", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});


// Handle specific routes first
app.get("/midle", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/profil", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/gamesa", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/liderboard", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/community", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/settings", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/local_game", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle all other routes with a wildcard
app.get("*", (req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
