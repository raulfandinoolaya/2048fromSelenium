// import deepstream from 'deepstream.io-client-js';

const element = document.getElementById("commands");
// const client = deepstream('http://localhost').login();

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

    var divtest = document.createElement("div");
    divtest.innerHTML = directions.get(keyCode);
    element.appendChild(divtest);

    if(keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40){
        currentKey = keyCode;
        var newCommand;
        if(currentKey == lastKey){
            var lastCommand = commandList.pop();
            var currentRepetions = lastCommand.repetitions;
            lastCommand.repetitions = currentRepetions + 1;
            commandList.push(lastCommand);
        }else{
            newCommand = new Command(commandId, directions.get(keyCode), 1, "ENTERED");
            commandList.push(newCommand);
            commandId++;
            lastKey = currentKey;
        }
        console.log(commandList);
    }else if(keyCode==13){
        record.set({
            personalData: {
                firstname: 'Homer',
                lastname: 'Simpson',
                status: 'married'
            },
            children: ['Bart', 'Maggie', 'Lisa']
        });
    }
}


