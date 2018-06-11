var express = require('express')
var app = express()
var path = require('path')
var cons = require('consolidate');
const deepstream = require( 'deepstream.io-client-js' );

const ds = deepstream( '0.0.0.0:6020/deepstream' );
ds.login();
var bodyParser = require("body-parser");

webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until,
chrome = require('selenium-webdriver/chrome'),
firefox = require('selenium-webdriver/firefox');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/'));

app.use(express.static(__dirname + '/node_modules/aut-styles/'));

app.set('view engine', 'ejs');

var commands = [];

// var myLogger = function (req, res, next) {
//     console.log('LOGGED')
//     next()
// }
//
// app.use(myLogger)


app.post("/commands", function(req, res) {
    console.log('New player:',req.body.newplayer);
    res.render("index", {
            commands: commands,
            newPlayer: req.body.newplayer,
            });
});

app.post("/play", function(req, res) {
    console.log('Commands:',req.body.newplayer);

    res.render("index", {
        commands: commands,
        newPlayer: req.body.newplayer,
    });
});


// app.get("/", function(req, res) {
//     res.render("registry");
// });

app.get("/", function(req, res) {
    res.render("registry");
});

app.use('/static', express.static('public'));

app.listen(3000)


// var path = require('chromedriver').path;
// var driver = chrome.Driver.createSession(new chrome.Options(), new
// chrome.ServiceBuilder(path).build());
//
// driver.get('http://mysite/myapp/tests/functional/start.html');
