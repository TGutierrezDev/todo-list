
const fs = require('fs')
const path = require('os').homedir() + '/todo';
const pathEventLogger = path + '/pel';
const prompt = require("prompt-sync")();
const chalk = require("chalk");
const dates = require("./dates.js")


class Event {
    // static id = 0;
    constructor(name, date, priority) {
        // this.id = this.id++;
        this.name = name;
        this.date = date;
        this.priority = priority;
    }
}


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
                args = prompt('Sort by? [d,p] : ')

        }

    }
}
const checkOption = (option) =>{
    return option >= 1 && option <= 4
}

function getDeleteArgs(){
    let textForPrompt = "Select an option:\n"+
        "1. Enter name, date, and priority to delete\n"+
        "2. Enter name\n" +
        "3. Enter date\n" +
        "4. Enter priority\n"
    console.log(textForPrompt)
    let option = prompt('Your choice : ')
    
    while(!checkOption(option)){
        console.log("Wrong choice.\n" + textForPrompt)
        option = prompt('Your choice : ')
    }
    let name, date, priority, options, eventToReturn, selection


    switch(option){
        case "1":
            name = prompt('Name : ')
            date = prompt('Date : ')
            priority = prompt('Priority : ')
            return {'name' : name, 'date' : new Date(date), 'priority' : priority}

        case "2":
            name = prompt('Name : ')
            options = getEventsWithName(name)
            if(options == "NO EVENTS"){
                console.log("There are no events called " + name)
                process.exit(1)
            }
            break; 
        case "3":
            date = prompt('Date : ')
            options = getEventsWithDate(date)
            
            if(options == "NO EVENTS"){
                console.log("There are no events with date " + date)
                process.exit(1)
            }
            break;

        case "4":

            priority = prompt('Priority : ')
            options = getEventsWithPriority(priority)
            
            if(options == "NO EVENTS"){
                console.log("There are no events with priority " + priority)
                process.exit(1)
            }
            break;
    }

    if(options instanceof Event)
        return options

    console.log(eventsToString(options))
    selection = prompt('Your selection :')
    while(selection < 1 || selection > options.length){
        console.log("Wrong choice\h" + eventsToString(options))
        selection = prompt('Your selection :')
    }
    eventToReturn  =  options[selection - 1]

    return new Event(eventToReturn.name, eventToReturn.date, eventToReturn.priority)

}



function getEventsWithPriority(priority){
    let data = fs.readFileSync(pathEventLogger)
    var jsonParsed = JSON.parse(data);
    let events = []

    jsonParsed.events.forEach(event => {
        if(event.priority == priority)
            events.push(event)
    })

    switch(events.length){
        case 0:
            return "NO EVENTS"
        case 1:
            return new Event(events[0].name, events[0].date, events[0].priority)
        default:
            return events
    }
}



function getEventsWithDate(date){
    let data = fs.readFileSync(pathEventLogger)
    var jsonParsed = JSON.parse(data);
    let events = []

    jsonParsed.events.forEach(event => {
        if(new Date(event.date).toLocaleDateString("es") == date)
            events.push(event)
    })

    switch(events.length){
        case 0:
            return "NO EVENTS"
        case 1:
            return new Event(events[0].name, events[0].date, events[0].priority)
        default:
            return events
    }
}


function eventsToString(events){
    let str = "Events that match:\n"
    for(let i = 0; i < events.length; i++){
        str += (i+1) + ". Name: " + events[i].name + ", Date: " + new Date(events[i].date).toLocaleDateString("es") + ", Priority: "
        + events[i].priority + ".\n"
    }
    return chalk.italic.blue(str)
}

function eventParser(event){
    return  "[name: " + event.name +
        ", date: " + new Date(event.date).toLocaleDateString("es") + 
        ", priority: " + event.priority + "]"
}

function getEventsWithName(name){

    let data = fs.readFileSync(pathEventLogger)
    var jsonParsed = JSON.parse(data);
    let eventsWithName = []

    jsonParsed.events.forEach(event => {
        if(event.name == name)
            eventsWithName.push(event)
    })
    switch(eventsWithName.length){
        case 0:
            return "NO EVENTS"
        case 1:
            return new Event(eventsWithName[0].name, eventsWithName[0].date, eventsWithName[0].priority)
        default:
            return eventsWithName
    }
}

module.exports = {
    getListArgs, getDeleteArgs, optionsCalled, createLog, createTodoFolder, parseEvents, eventParser
}
