#! /usr/bin/env node

const yargs = require("yargs");
const fs = require('fs');
const readline = require('readline');
const prompt = require("prompt-sync") ();

class Event {
    // static id = 0;
    constructor(name, date, priority) {
        // this.id = this.id++;
        this.name = name;
        this.date = date;
        this.priority = priority;
    }
}

const path = require('os').homedir() + '/todo';
const pathEventLogger = path + '/pel';

if(!fs.existsSync(pathEventLogger)) {
    const events = {
        events: []
    }
    fs.writeFileSync(pathEventLogger, JSON.stringify(events), (err) => {
        if(err) 
            console.log("Error" + err);
    });
}

const options = yargs.
        option("l", {alias: 'list', describe: 'Show to do list.', demandOption: false}).
        option("a", {alias: 'add', describe: 'Add to the to do list.', type: 'int', demandOption: false}).
        option("d", {alias: 'delete', describe: 'Delete from the to do list.', type: 'int', demandOption: false}).
        option("m", {alias: 'modify', describe: 'Modify a event from the to do list.', type: 'int', demandOption: false}).
        help(true).argv;

if(!fs.existsSync(path))
    fs.mkdir(path, (err) => {
        if(err) 
            console.log("Error" + err);
    });

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

if(argv.l || argv.list) {
    console.log('List of Events');
    fs.readFile(pathEventLogger,
        function(err, data) {
            if(err) {
                console.log("Error" + err);
                process.exit();
            }
            var jsonParsed = JSON.parse(data);
            jsonParsed.events.forEach(event => {
                console.log('Event name: ' + event.name + ' the day ' + event.date + ' and priority ' + event.priority + ".");
            });
        }
    );
}

if(argv.a || argv.add) {
    console.log('Add a Event');

    const name = prompt('What is the name of the Event? ');
    const date = prompt('What is the date of the Event? ');
    const priority = prompt('What is the priority of the Event? ');

    const event = new Event(name, date, priority);

    fs.readFile(pathEventLogger,
        function(err, data) {
            if(err) {
                console.log("Error" + err);
                process.exit();
            }
            var jsonParsed = JSON.parse(data);
            jsonParsed.events.push(event);
            fs.writeFileSync(pathEventLogger, JSON.stringify(jsonParsed), (err) => {
                if(err) 
                    console.log("Error" + err);
            });
        }
    );
}
