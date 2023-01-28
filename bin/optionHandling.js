
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
            jsonParsed.events.forEach(event => {
                listOfEvents += "*  " + chalk.red(event.name) + ' the day ' + chalk.green(new Date(event.date).toDateString())
                    + ' with a priority of ' + chalk.blue(event.priority) + ".\n";
            });

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

    const name = prompt(chalk.red('What is the name of the Event? '));
    var dateStr = prompt(chalk.green('What is the date of the Event? '));
    let date = new Date(dates.dateFormatter(dateStr))
    while (date.toDateString() == "Invalid Date") {
        dateStr = prompt(chalk.green('INVALID DATE\nWhat is the date of the Event? '));
        date = new Date(dates.dateFormatter(dateStr))
    }
    var priority = prompt(chalk.blue('What is the priority of the Event? '));
    while (!checkPriority(priority)) {
        priority = prompt(chalk.red('INVALID PRIORITY, choose a number between 1 - 10 '));
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
}


//deletes the logfile
const empty = () => {
    fs.rmSync(pathEventLogger)
}


module.exports = {
    optionsCalled, list, add, createTodoFolder, createLog, empty
};
