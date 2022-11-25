var fs = require("fs");
var process = require("process");

var vars = [];
var waiting = false;
var linecount = 1;

var compiler = {
    wait: function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    stringvarstransform: function(toconcat){
        var index = 0;
        var index2 = 2;
        var rconcat = toconcat;
        while (index < toconcat.length){
            rconcat = rconcat.replace(vars[(index2 - 2)], vars[index2 - 1]);
            index += 1;
            index2 += 2;
        }
        while (rconcat.includes('"')){
            rconcat = rconcat.replace('"', "");
        }
        return rconcat;
    },
    compile: async function(line){
        if ((line.slice(0, -(line.length  - ("console(".length)))) === "console("){
            if ((line.slice((line.length - 2), -1)) === ")"){
                if ((line.slice((line.length - 1))) === ";"){
                }
                else{
                    console.log('[Error] ";" exepted at line ' + linecount);
                    process.exit(0);
                }
            }
            else{
                console.log('[Error] ")" exepted at line ' + linecount);
                process.exit(0);
            }
            var result = compiler.stringvarstransform((line.slice(("console(".length), -2)));
            if (result === undefined){
                console.log('[Error] A var in this line does not exist at line ' + linecount);
                process.exit(0);
            }
            else{
                console.log(result);
            }
        }
        else{
            if ((line.slice(0, -(line.length  - ("console.clear(".length)))) === "console.clear("){
                if ((line.slice((line.length - 2), -1)) === ")"){
                    if ((line.slice((line.length - 1))) === ";"){
                    }
                    else{
                        console.log('[Error] ";" exepted at line ' + linecount);
                        process.exit(0);
                    }
                }
                else{
                    console.log('[Error] ")" exepted at line ' + linecount);
                    process.exit(0);
                }
                console.clear();
            }
            else{
                if ((line.slice(0, -(line.length  - ("wait(".length)))) === "wait("){
                    if ((line.slice((line.length - 2), -1)) === ")"){
                        if ((line.slice((line.length - 1))) === ";"){
                        }
                        else{
                            console.log('[Error] ";" exepted at line ' + linecount);
                            process.exit(0);
                        }
                    }
                    else{
                        console.log('[Error] ")" exepted at line ' + linecount);
                        process.exit(0);
                    }
                    waiting = (parseInt(line.slice(("wait(".length), -2)));
                }
                else{
                    if ((line.slice(0, -(line.length  - ("var ".length)))) === "var "){
                        if ((line.slice((line.length - 1))) === ";"){
                        }
                        else{
                            console.log('[Error] ";" exepted at line ' + linecount);
                            process.exit(0);
                        }
                        var varsplit = line.split("=");
                        varsplit[0] = varsplit[0].slice(4, -1);
                        varsplit[1] = varsplit[1].slice(0, -1);
                        vars.push(varsplit[0]);
                        vars.push(compiler.stringvarstransform(varsplit[1]));
                    }
                    else{
                        if (line === ""){
                        }
                        else{
                            console.log('[Error] Uncaught expression at line ' + linecount);
                            process.exit(0);
                        }
                    }
                }
            }
        }
    }
}

var file = fs.readFileSync(__dirname + "/script.csc");

`${file}`.split(/\r?\n/).forEach(async line => {
    if (!waiting === false){
        await compiler.wait(waiting);
        waiting = false;
    }
    compiler.compile(line);
    linecount += 1;
});