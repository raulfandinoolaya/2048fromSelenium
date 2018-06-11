// const deepstream = require('deepstream.io-client-js')

const element = document.getElementById("commands");

document.addEventListener('keydown', handleKeyPress);

var directions = new Map();

directions.set(37, 'LEFT');
directions.set(38, 'UP');
directions.set(39, 'RIGHT');
directions.set(40, 'DOWN');

class Command {
    constructor(id, direction, repetitions, state) {
        this.id = id;
        this.direction = direction;
        this.repetitions = repetitions;
        this.state = state;
        this.fails = 0;
    }
}

let commandList = [];
let commandId = 1;
let currentKey = '';
let lastKey= '';

function handleKeyPress (e){
    keyCode= e.keyCode;


    if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
        currentKey = keyCode;
        var newCommand;
        var commandUI = document.createElement("INPUT");
        commandUI.setAttribute("type", "text");
        commandUI.setAttribute("readonly", true);
        commandUI.setAttribute("name", "commandFields");
        if(currentKey == lastKey){
            var lastCommand = commandList.pop();
            var currentRepetions = lastCommand.repetitions;
            lastCommand.repetitions = currentRepetions + 1;
            commandList.push(lastCommand);
            element.lastChild.remove();
            commandUI.setAttribute("value","x"+lastCommand.repetitions + " to " + lastCommand.direction);
            element.appendChild(commandUI);
        }else{
            newCommand = new Command(commandId, directions.get(keyCode), 1, "ENTERED");
            commandList.push(newCommand);
            commandId++;
            lastKey = currentKey;
            commandUI.setAttribute("value","x"+newCommand.repetitions + " to " + newCommand.direction);
            element.appendChild(commandUI);
        }
        console.log(commandList);
    }
}


