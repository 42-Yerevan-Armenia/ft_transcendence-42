const express = require('express');
const path = require('path');

const app = express();

app.use('/src', express.static('src'));
app.use('/signin', express.static('signin'));
app.use('/signup', express.static('signup'));
app.use('/public', express.static('public'));

app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('index.html'));
});
app.get('/index.html', (req, res) => {
    res.sendFile(path.resolve('index.html'));
});
app.get('*', (req, res) => {
    res.redirect("/")
});


const port = process.env.PORT || 3001;

app.listen(port, () => console.log('Server working...on port:'+port));
