var express = require('express')
var app = express()
var path = require('path')
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
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.post("/commands", function(req, res) {
    console.log('New player:',req.body.newplayer);
    res.render("index", {
            newPlayer: req.body.newplayer,
            });
});


app.post("/play", function(req, res) {
    res.render("selenium", {
        newPlayer: req.body.newplayer,
        commands: req.body.commandFields,
    });
    seleniumExecution(req.body.commandFields);
});

app.get("/scoreboard", function(req, res) {
    res.render("scoreboard");
});

app.get("/", function(req, res) {
    res.render("registry");
});

app.use('/static', express.static('public'));


app.listen(3000)
async function seleniumExecution(commandFields) {
    var path = require('chromedriver').path;

    console.log("commands: ",commandFields);

    var driver = chrome.Driver.createSession(new chrome.Options(), new
    chrome.ServiceBuilder(path).build());
    driver.get('http://2048game.com/');
    var score = await driver.findElement(By.className("score-container")).getText()

    for (var i in commandFields) {
        currentCommand = commandFields[i];
        const repetitions = currentCommand.substring(1, 2);
        const direction = currentCommand.split(" ")[2];
        console.log("Repetitions: ", repetitions);
        console.log("Direction: ", direction);
    }

}
