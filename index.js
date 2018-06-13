var express = require('express')
var mongojs = require('mongojs')
var app = express()
var path = require('path')

var db = mongojs('autogame', ['scores'])

var bodyParser = require("body-parser");
const {Builder, By, Key, until} = require('selenium-webdriver');
global.player = new Map();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public/'));

app.use(express.static(__dirname + '/node_modules/aut-styles/'));
app.use(express.static(__dirname + '/img/'));

app.set('view engine', 'ejs');

app.post("/commands", function(req, res) {
    this.player = req.body.newplayer;
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
    let scoresFromDB;

    db.scores.find().sort({finalScore: -1}, function (err, docs) {
        scoresFromDB = docs;

        res.render("scoreboard", {
            scores: scoresFromDB
        });
    })
});

app.get("/", function(req, res) {
    res.render("registry");
});

app.use('/static', express.static('public'));


app.listen(3000)

async function seleniumExecution(commandFields) {
    let driver = await new Builder().forBrowser('firefox').build();
    let fails = 0;
    let finalScoreInTheGame = 0;
    let finalScoreMinusFails = 0;
    console.log("Let's start", player+ "!")
    try{
        await driver.get('http://2048game.com/');
        const score = await driver.findElement(By.className("score-container"));
        const additionalScore = await driver.findElement(By.className("score-container"));
        const board = await driver.findElement(By.className("game-container"));
        for (var i in commandFields) {
            currentCommand = commandFields[i];
            console.log("Command:",currentCommand);
            const repetitions = currentCommand.substring(1, 2);
            const direction = currentCommand.split(" ")[2];
            console.log(currentCommand);
            const actions = driver.actions();

            for (var j=0; j<repetitions; j++){
                const numbersBefore = await board.getText();
                switch (direction) {
                    case 'UP':
                        await actions.sendKeys(Key.UP).perform();
                        break;
                    case 'DOWN':
                        await actions.sendKeys(Key.DOWN).perform();
                        break;
                    case 'RIGHT':
                        await actions.sendKeys(Key.RIGHT).perform();
                        break;
                    case 'LEFT':
                        await actions.sendKeys(Key.LEFT).perform();
                        break;
                }
                const numbersAfter = await board.getText();
                if(numbersBefore!=numbersAfter){
                    console.log("Good point")
                }else{
                    console.log("Ouch, your command hadn't effect")
                    fails++;
                }
            }
            console.log("your score so far:", await score.getText());
        }
        await sleep(2000);
        finalScoreInTheGame = await score.getText();
        finalScoreMinusFails = finalScoreInTheGame - (finalScoreInTheGame * fails / 100);
        console.log("Your base score is",finalScoreInTheGame, "but you had",fails, "commands without any effect in the game, so we are " +
            "substracting", fails+"%,","so your final score is:",finalScoreMinusFails+".");
    } finally {
        await driver.quit();
    }
    try{
    db.scores.insert({  player: this.player,
        finalScore: roundToTwo(finalScoreMinusFails),
        actualScoreInTheGame: roundToTwo(finalScoreInTheGame),
        fails: fails});
    }catch(err) {
        console.log(err.message);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
