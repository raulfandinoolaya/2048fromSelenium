var express = require('express')
var app = express()

webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until,
chrome = require('selenium-webdriver/chrome'),
firefox = require('selenium-webdriver/firefox');

var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000)


var path = require('chromedriver').path;
var driver = chrome.Driver.createSession(new chrome.Options(), new 
chrome.ServiceBuilder(path).build());

driver.get('http://mysite/myapp/tests/functional/start.html');
