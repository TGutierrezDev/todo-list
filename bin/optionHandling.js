
const helper = require('./helper.js')
const fs = require('fs')
const chalk = require("chalk")
const prompt = require("prompt-sync")();
const dates = require("./dates.js")
const path = require('os').homedir() + '/todo';
const pathEventLogger = path + '/pel';


class Event {
    // static id = 0;
    constructor(name, date, priority) {
        // this.id = this.id++;
        this.name = name;
        this.date = date;
        this.priority = priority;
    }
    contains(name){
        return true;
    }
}

//print a formatted version of the log file
const list = (argv) => {
    var listOfEvents = 'List of Events\n';
    fs.readFile(pathEventLogger,
        function (err, data) {
            if (err) {
                console.log("Error" + err);
                process.exit();
            }
            var jsonParsed = JSON.parse(data);
            //here i should sort the events to show them in a determinated order
            jsonParsed.events = sortBy(jsonParsed, argv)        
    
            listOfEvents += helper.parseEvents(jsonParsed.events, argv)

            if (listOfEvents == 'List of Events')
                console.log("There are no events on the list")
            else
                console.log(listOfEvents)
        }
    );

}

//check if a given priority is valid
const checkPriority = (priority) => {
    return priority >= 1 && priority <= 10
}

//add to the list
const add = () => {
    console.log('Add a Event');

    const name = prompt(chalk.italic('What is the name of the Event? '));
    var dateStr = prompt(chalk.italic('What is the date of the Event? '));
    let date = new Date(dates.dateFormatter(dateStr))
    while (date.toDateString() == "Invalid Date") {
        console.log(chalk.red('INVALID DATE'))
        dateStr = prompt(chalk.italic('What is the date of the Event? '))
        date = new Date(dates.dateFormatter(dateStr))
    }
    var priority = prompt(chalk.italic('What is the priority of the Event? '));
    while (!checkPriority(priority)) {
        console.log(chalk.red('INVALID PRIORITY\n'))
        priority = prompt(chalk.italic('choose a number between 1 - 10 '));
    }

    const event = new Event(name, date, priority);

    fs.readFile(pathEventLogger,
        function (err, data) {
            if (err) {
                console.log(err);
                process.exit();
            }
            var jsonParsed = JSON.parse(data);
            jsonParsed.events.push(event);
            fs.writeFileSync(pathEventLogger, JSON.stringify(jsonParsed), (err) => {
                if (err)
                    console.log(err);
            });
        }
    );

    console.log(chalk.green("The Event " + helper.eventParser(event) + " has been successfully added!"))

}
function sortByDate(events){
    events.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
    })
    return events
}

function sortByPriority(events){
    events.sort((a,b) =>{
        return b.priority - a.priority
    })
    return events
}

function sortBy(json, options){
    if(options.length == 0)
        return json.events
    let events = json.events

    if(options.length == 2){ //sort by date and priority
        events = sortByDate(events)
        events = sortByPriority(events)
        return events
    }

    if(options[0] == 'd'){
        return sortByDate(events)
    }
    return sortByPriority(events)
}

//deletes the logfile
const empty = () => {
    fs.rmSync(pathEventLogger)
}

function myIncludes(arr, item){
    console.log(arr)
    console.log(item)
    for(let i = 0; i < arr.length; i++){
        let cur = arr[i]
        if(cur.name == item.name && cur.date == item.date && cur.priority == item.priority)
            return true
    }
    return false
}

function myFilter(arr, item){
    let ret = []
    for(let i = 0; i < arr.length; i++){
        let cur = arr[i]
        if(cur.name == item.name && cur.date == item.date && cur.priority == item.priority)
            continue
        ret.push(cur)
    }
    return ret
}

function deleteEvent(args){

    let data = fs.readFileSync(pathEventLogger)
    let jsonParsed = JSON.parse(data);
    let events = jsonParsed.events 
    //console.log(events)
    //console.log(args)

    let hasTheEvent = myIncludes(events, args) 
    if(!hasTheEvent){
        console.log("The Event " + args.name, args.date, args.priority + " is not contained in the list")
        return
    }

    let resultArr = myFilter(events, args)
    jsonParsed.events = resultArr

    fs.writeFileSync(pathEventLogger, JSON.stringify(jsonParsed), (err) => {
        if (err)
            console.log(err);
    });

    console.log(chalk.green("The Event " + helper.eventParser(args) + " has been successfully deleted!"))
}

module.exports = {
    list, add, empty, deleteEvent
};
