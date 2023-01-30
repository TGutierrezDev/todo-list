
const fs = require('fs')
const path = require('os').homedir() + '/todo';
const pathEventLogger = path + '/pel';
const prompt = require("prompt-sync")();
const chalk = require("chalk")

const createTodoFolder = () => {
    if (!fs.existsSync(path))
        fs.mkdir(path, (err) => {
            if (err)
                console.log(err);
        });
}


const createLog = () => {
    if (!fs.existsSync(pathEventLogger)) {
        const events = {
            events: []
        }
        fs.writeFileSync(pathEventLogger, JSON.stringify(events), (err) => {
            if (err)
                console.log("Error" + err);
        });
    }
}


function parseEvents(events, args){
    let listOfEvents = ""
    switch(args){
        case "d":
            let strDate = events[0].date
            let curDate = new Date(strDate)
            listOfEvents += "-----" + curDate.toLocaleDateString("es") + " :\n"
            
            events.forEach(event => {
                let auxDate = event.date
                if(auxDate !=  strDate){
                    strDate = auxDate
                    curDate = new Date(strDate)
                    listOfEvents += "\n-----" + curDate.toLocaleDateString("es") + " :\n"
                }
                
                listOfEvents += "*  " + chalk.red(event.name) +
                    ' , priority : ' + chalk.blue(event.priority) + ".\n";

            })
            break;
        
        case "p":
            let curPriority = events[0].priority
            listOfEvents += "With priority " + curPriority + ":\n"

            events.forEach(event => {
                let auxPriority = event.priority
                if(auxPriority != curPriority){
                    curPriority = auxPriority
                    listOfEvents += "\nWith priority " + curPriority + ":\n"
                }

                listOfEvents += "*  " + chalk.red(event.name) + ' the day '
                    + chalk.green(new Date(event.date).toLocaleDateString("es")) + ".\n"
            })
            break;
        
        default:
            events.forEach(event => {
                listOfEvents += "*  " + chalk.red(event.name) + ' the day '
                    + chalk.green(new Date(event.date).toLocaleDateString("es"))
                    + ' with a priority of ' + chalk.blue(event.priority) + ".\n";
            })
            break;
    }

    return listOfEvents
}



//returns an object with the options received in the program arguments
const optionsCalled = (argv) => {
    var options = {}

    if (argv.l || argv.list) {
        options.list = true;
    }

    if (argv.a || argv.add) {
        options.add = true;
    }

    if (argv.d || argv.delete) {
        options.delete = true;
    }

    if (argv.m || argv.modify) {
        options.modify = true;
    }
    if (argv.e || argv.empty) {
        options.empty = true;
    }

    return options;
}
function getListArgs(){
    let args = prompt('Sort by? [d,p] : ')
    
    while(1){

        switch(args){
            case "d":
            case "p":
            case "dp":
            case "pd":
            case "":
                return args
            default:
                args = prompt('Sort by? [d,p]')

        }

    }
}
module.exports = {
    getListArgs, optionsCalled, createLog, createTodoFolder, parseEvents
}
