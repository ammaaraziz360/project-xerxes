var express = require('express');
var path = require('path');

// create a new express app
var app = express();
// require bodyparser and axios
const bodyParser  = require('body-parser');
const axios = require("axios");

// load body parser and allow use of custom css
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set('view engine', 'ejs');

// default route
app.get('/', function(req, res) {
    res.render('./pages/home')
});

const port = 3000
app.listen(port, () => {
    console.log(`Front-end app listening at http://localhost:${port}`)
})