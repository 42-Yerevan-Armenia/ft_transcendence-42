const express = require("express");
const path = require("path");

const app = express();

// Serve static files from various directories
app.use(express.static(path.join(__dirname, "/")));
app.use(express.static(path.join(__dirname, "/Start")));
app.use(express.static(path.join(__dirname, "/src/app")));
app.use(express.static(path.join(__dirname, "/src/app/models")));
app.use(express.static(path.join(__dirname, "/src/app/styles")));
app.use(express.static(path.join(__dirname, "/src/app/models/Home")));
app.use(express.static(path.join(__dirname, "/src/app/models/Home/public")));
app.use(express.static(path.join(__dirname, "/src/app/models/Home/game")));

// Handle specific routes first
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Start", "index.html"));
});

// Handle specific routes first
app.get("/signin", (req, res) => {
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

// Handle all other routes with a wildcard
app.all("/setdata", (req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Start the server
const port = 3006;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});















// "dev": "nodemon --require dotenv/config  ./index.js"