#! /usr/bin/env node

//App.js
//

//Require fs
var fs = require('fs');
//Require process
var process = require('process');

//Get args
var args = process.argv.slice(2);

//Get path
var path = args[0];

//Define interpreter obj
var interpreter = {
    vars: {
        name: [],
        values: []
    },
    dynamic: function(code, linecount){
        var split = code.split('"');
        var index = 0;
        var result = "";
        while (index < split.length){
            if (split[index] === ""){
                result += split[index + 1];
                index += 2;
                //If split at index is not empty string
                if (split[index] !== "" && split[index] !== undefined){
                    console.log(`[Coolscript/error] Error: Exepted '"' | Error at line: ` + linecount)
                    process.exit(1);
                }
            }
            else {
                //If split at index is not a number
                if (isNaN(split[index])){
                    //If is math
                    if (split[index].includes("+") || split[index].includes("-") || split[index].includes("*") || split[index].includes("/")){
                        var math = split[index].split(" ");
                        var mathresult = 0;
                        var mathindex = 0;
                        while (mathindex < math.length){
                            //If math at mathindex or mathindex + 1 is Math.PI, replace with Math.PI
                            if (math[mathindex] === "Math.PI"){
                                math[mathindex] = Math.PI;
                            }
                            if (math[mathindex + 1] === "Math.PI"){
                                math[mathindex + 1] = Math.PI;
                            }
                            if (math[mathindex] === "+"){
                                mathresult += parseFloat(math[mathindex + 1]);
                                mathindex += 2;
                            }
                            else if (math[mathindex] === "-"){
                                mathresult -= parseFloat(math[mathindex + 1]);
                                mathindex += 2;
                            }
                            else if (math[mathindex] === "*"){
                                mathresult *= parseFloat(math[mathindex + 1]);
                                mathindex += 2;
                            }
                            else if (math[mathindex] === "/"){
                                mathresult /= parseFloat(math[mathindex + 1]);
                                mathindex += 2;
                            }
                            else {
                                mathresult = parseFloat(math[mathindex]);
                                mathindex += 1;
                            }
                        }
                        index += 1;
                        result += mathresult;
                    }
                    else{
                        //If is var
                        var index2 = 0;
                        var addtoresult = "";
                        while (index2 < interpreter.vars.name.length){
                            if (split[index] === interpreter.vars.name[index2]){
                                addtoresult += interpreter.vars.values[index2];
                                break;
                            }
                            index2 += 1;
                        }
                        index += 1;
                        if (addtoresult !== ""){
                            result += addtoresult;
                        }
                        else{
                            console.log("[Coolscript/error] Error: Variable '" + split[index - 1] + "' is not defined | Error at line: " + linecount);
                            process.exit(1);
                        }
                    }
                }
                else{
                    //If split at index is Math.PI, replace with Math.PI
                    if (split[index] === "Math.PI"){
                        result += Math.PI;
                    }
                    else{
                        result += split[index];
                        index += 1;
                    }
                }
            }
        }
        //If ends with undefined (check with slice method)
        if (result.slice((result.length - "undefined".length)) === "undefined"){
            //Remove undefined
            result = result.slice(0, -("undefined".length));
        }
        return result;
    },
    //Define interpreter function
    interpret: function(code, linecount) {
        //If code starts with 'console' (check with slice)
        if (code.slice(0, -(code.length - ("console".length))) === 'console') {
            //If '(' isn't missing
            if ((code.slice(("console".length), -(code.length - (("console".length) + 1)))) === "("){
                //Check if ');' isn't missing
                if (code.slice(-2) === ');') {
                    //If all is good, log the code
                    var content = ((code.slice(("console".length) + 1, -2)));
                    console.log(interpreter.dynamic(content, linecount));
                }
                else{
                    console.log("[Coolscript/error] Error: Exepted ');' | Error at line: " + linecount);
                    process.exit(1);
                }
            }
            else{
                console.log("[Coolscript/error] Error: Exepted '(' | Error at line: " + linecount);
                process.exit(1);
            }
        }
        else{
            //If code starts with 'var' (check with slice)
            if (code.slice(0, -(code.length - ("var".length))) === 'var') {
                //If '=' isn't missing
                var tmp = code.split("=");
                if (!`${tmp}`.includes("=")){
                    //Check if ';' isn't missing
                    if (code.slice((code.length - 1)) === ';') {
                        //If all is good, log the code
                        var index = (code.length);
                        while ((`${code.slice(index)}`.includes("=")) === false){
                            index -= 1;
                            if (index === -1){
                                console.log("[Coolscript/error] Error: Exepted '=' | Error at line: " + linecount);
                                process.exit(1);
                            }
                        }
                        var name = code.slice(("var ".length), (index - 1));
                        var value = code.slice(index + 2, -1);
                        //Check if not already defined
                        var index2 = 0;
                        while (index2 < interpreter.vars.name.length){
                            if (interpreter.vars.name[index2] === name){
                                console.log("[Coolscript/error] Error: Variable '" + name + "' is already defined | Error at line: " + linecount);
                                process.exit(1);
                            }
                            index2 += 1;
                        }
                        interpreter.vars.name.push(name);
                        interpreter.vars.values.push(interpreter.dynamic(value, linecount));
                    }
                    else{
                        console.log("[Coolscript/error] Error: Exepted ';' | Error at line: " + linecount);
                        process.exit(1);
                    }
                }
                else{
                    console.log("[Coolscript/error] Error: Exepted '=' | Error at line: " + linecount);
                    process.exit(1);
                }
            }
            else{
                //If code starts with 'sleep' (check with slice)
                if (code.slice(0, -(code.length - ("sleep".length))) === 'sleep') {
                    //If '(' isn't missing
                    if ((code.slice(("sleep".length), -(code.length - (("sleep".length) + 1)))) === "("){
                        //Check if ');' isn't missing
                        if (code.slice(-2) === ');') {
                            //If all is good, log the code
                            var content = ((code.slice(("sleep".length) + 1, -2)));
                            var time = interpreter.dynamic(content, linecount);
                            if (isNaN(time)){
                                console.log("[Coolscript/error] Error: Exepted number | Error at line: " + linecount);
                                process.exit(1);
                            }
                            else{
                                interpreter.wait = parseInt(time);
                            }
                        }
                        else{
                            console.log("[Coolscript/error] Error: Exepted ');' | Error at line: " + linecount);
                            process.exit(1);
                        }
                    }
                    else{
                        console.log("[Coolscript/error] Error: Exepted '(' | Error at line: " + linecount);
                        process.exit(1);
                    }
                }
                else{
                    //If code starts with a variable name
                    var index = 0;
                    var name = "";
                    while (index < code.length){
                        if (code[index] === "="){
                            break;
                        }
                        name += code[index];
                        index += 1;
                    }
                    name = name.slice(0, -1);
                    var index2 = 0;
                    var isdefined = false;
                    while (index2 < interpreter.vars.name.length){
                        if (name === interpreter.vars.name[index2]){
                            isdefined = true;
                            break;
                        }
                        index2 += 1;
                    }
                    if (isdefined){
                        //If '=' isn't missing
                        if (code.slice(index, -(code.length - (index + 1))) === "="){
                            //Check if ';' isn't missing
                            if (code.slice(-1) === ';') {
                                //If all is good, log the code
                                var value = code.slice(index + 2, -1);
                                interpreter.vars.values[index2] = interpreter.dynamic(value, linecount);
                            }
                            else{
                                console.log("[Coolscript/error] Error: Exepted ';' | Error at line: " + linecount);
                                process.exit(1);
                            }
                        }
                        else{
                            console.log("[Coolscript/error] Error: Exepted '=' | Error at line: " + linecount);
                            process.exit(1);
                        }
                    }
                    else{
                        console.log("[Coolscript/error] Error: Variable '" + name + "' is not defined | Error at line: " + linecount);
                        process.exit(1);
                    }
                }
            }
        }
    },
    //Wait propertie
    wait: undefined
}

//If path exists
if (fs.existsSync(path)){
    //If path is a file
    if (fs.statSync(path).isFile()){
        //Read file
        var file = fs.readFileSync(path, "utf-8");
        var lines = file.split("\n");
        //Loop through lines
        var index = 0;
        while (index < lines.length){
            //Get line
            var line = lines[index];
            //Interpret line
            interpreter.interpret(line, (index + 1));
            //If waiting is not undefined
            if (interpreter.wait !== undefined){
                //Sleep for the value of wait
                var start = new Date();
                var now = undefined;
                do {
                    now = new Date();
                }
                while (now - start < interpreter.wait);
                //Set wait to undefined
                interpreter.wait = undefined;
            }
            //Increment index
            index += 1;
        }
        process.exit(0);
    }
}