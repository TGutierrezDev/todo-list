#! /usr/bin/env node
const handler = require("./optionHandling")
const yargs = require("yargs");
const chalk = require('chalk')
const figlet = require('figlet')
const helper = require('./helper.js')

console.log(chalk.yellow(figlet.textSync('Todo List', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
})))


helper.createTodoFolder() //checks if the todo folder in the homedir is created, and creates it if its not
helper.createLog() // same with the logfile


//set up the options
yargs.
    option("l", { alias: 'list', describe: 'Show to do list.', demandOption: false }).
    option("a", { alias: 'add', describe: 'Add to the to do list.', type: 'int', demandOption: false }).
    option("d", { alias: 'delete', describe: 'Delete from the to do list.', type: 'int', demandOption: false }).
    option("m", { alias: 'modify', describe: 'Modify a event from the to do list.', type: 'int', demandOption: false }).
    option("e", { alias: 'empty', describe: 'Empty the list', demandOption: false }).
    help(true).argv;


const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

//if no option or more than one option are used, exit
if (Object.keys(helper.optionsCalled(argv)).length == 0 || Object.keys(helper.optionsCalled(argv)).length > 1) {
    console.log(chalk.red("You have to provide a valid parameter"));
    process.exit(1);
}

//list 
if (argv.l || argv.list) {
    let args =  helper.getListArgs()
    handler.list(args)
}

//add
if (argv.a || argv.add) {
    handler.add()
}
//empty the list
if (argv.e || argv.empty) {
    handler.empty();
}
//delete an event
if (argv.d || argv.delete){
    let args = helper.getDeleteArgs()
    handler.deleteEvent(args) 
}
//TODO modify
if (argv.m || argv.modify){
    let args = helper.getModifyArgs()
    handler.modify(args)
}



