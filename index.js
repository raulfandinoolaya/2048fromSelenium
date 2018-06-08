var express = require('express')
var app = express()
var path = require('path')
var ioHook = require('iohook')

var bodyParser = require("body-parser");

webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until,
chrome = require('selenium-webdriver/chrome'),
firefox = require('selenium-webdriver/firefox');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

var directions = new Map();

directions.set(123, 'LEFT');
directions.set(124, 'RIGHT');
directions.set(125, 'DOWN');
directions.set(126, 'UP');

class Command {
    constructor(id, direction, repetions, state) {
        this.id = id;
        this.direction = direction;
        this.repetions = repetions;
        this.state = state;
        this.fails = 0;
    }
}

var commands = [];
var commandId = 1;
var currentKey;
var lastKey;

ioHook.on("keydown", event => {
    // console.log("ALGO")
    var keyCode = event.rawcode;
    if(keyCode == 123 || keyCode == 124 || keyCode == 125 || keyCode == 126){
        currentKey = keyCode;
        var newCommand;
        if(currentKey == lastKey){
            var lastCommand = commands.pop();
            var currentRepetions = lastCommand.repetions;
            lastCommand.repetions = currentRepetions + 1;
            commands.push(lastCommand);
        }else{
            newCommand = new Command(commandId, directions.get(keyCode), 1, "ENTERED");
            commands.push(newCommand);
            commandId++;
            lastKey = currentKey;
        }
        console.log(commands);
    }else{
        console.log("It's not a direction key");
    }
    return res => {
        console.log("OTRA COSA")
        res.render("index", { commands: commands});
    }
});

var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
}

app.use(myLogger)

ioHook.start();

var task = ["buy socks", "practise with nodejs"];

app.post('/addtask', function (req, res) {
    console.log('asas',req.body.newtask);
    var newTask = req.body.newtask;
    task.push(newTask);
    res.redirect("/");
});

app.get("/", function(req, res) {
    res.render("index", { commands: commands});
});

app.listen(3000)


// var path = require('chromedriver').path;
// var driver = chrome.Driver.createSession(new chrome.Options(), new
// chrome.ServiceBuilder(path).build());

//driver.get('http://mysite/myapp/tests/functional/start.html');
