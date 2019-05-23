#!/usr/bin/env node
"use strict";

var inquirer = require("inquirer");
var PropertiesReader = require('properties-reader');
var chalk = require("chalk");
const path = require("path");

var dirpath = path.resolve(__dirname);

var response = chalk.bold.green;

var resume;
var resumePrompts;
var properties;


function main() {
    inquirer
    .prompt({
        type: "list",
        name: "language",
        message: "Choose a language - Choisir une langue",
        choices: ["English", "Français", "Exit/Sortir"]
    })
    .then(choice => {
        if (choice.language == "English") {
            
            resume = require(path.join(dirpath, "resume.json"));
            properties = PropertiesReader(path.join(dirpath, "en.properties"));
            resumePrompts = {
                type: "list",
                name: "resumeOptions",
                message: "What do you want to know about me?",
                choices: [...Object.keys(resume), "Exit"]
            };
            
            console.log("Hello, My name is Abderrahim OUBIDAR and welcome to my resume");
            resumeHandler(resume, resumePrompts);
        }
        else if (choice.language == "Français") {

            resume = require(path.join(dirpath, "cv.json"));
            properties = PropertiesReader(path.join(dirpath, "fr.properties"));
            resumePrompts = {
                type: "list",
                name: "resumeOptions",
                message: "Que voulez-vous savoir sur moi?",
                choices: [...Object.keys(resume), "Sortir"]
            };
            console.log("Bonjour, Je m'appelle Abderrahim OUBIDAR, bienvenu dans mon CV");
            resumeHandler(resume, resumePrompts);
        }
        else {
            return;
        }
    });
}

function isArray(a) {
    return (!!a) && (a.constructor === Array);
};

function resumeHandler(resume, resumePrompts) {

    var back = properties.get('choice.back');
    var exit = properties.get('choice.exit');

    inquirer.prompt(resumePrompts).then(answer => {
        if (answer.resumeOptions == properties.get('choice.exit')) {
            return;
        }
        var option = answer.resumeOptions;

        if (isArray(resume[`${option}`])) {
            displayChoises(resume[`${option}`]);
        } else {
            var msg ;
            if(answer.resumeOptions == properties.get('choice.experience')) {
                msg = properties.get('msg.experience');
            } 

            if(answer.resumeOptions == properties.get('choice.skill')) {
                msg = properties.get('msg.skill');
            } 
            inquirer
                .prompt({
                    type: "list",
                    name: "moreOptions",
                    message: (msg) ? msg : (properties.get('msg.general') + answer.resumeOptions),
                    choices: [...Object.keys(resume[`${option}`]), back, exit]
                })
                .then(choice => {
                    if (choice.moreOptions == back) {
                        resumeHandler(resume, resumePrompts);
                    } else if(choice.moreOptions == exit) {
                        return;
                    } else {
                        displayChoises(resume[`${option}`][`${choice.moreOptions}`]);
                    }
                });
        }
    });

    function displayChoises(option) {
        console.log(response("--------------------------------------"));
        option.forEach(info => {
            console.log(response("|   => " + info));
        });
        console.log(response("--------------------------------------"));
        inquirer
            .prompt({
                type: "list",
                name: "exitBack",
                message: properties.get('msg.exitBack'),
                choices: [back, exit]
            })
            .then(choice => {
                if (choice.exitBack == back) {
                    resumeHandler(resume, resumePrompts);
                }
                else {
                    return;
                }
            });
    }
}

main();