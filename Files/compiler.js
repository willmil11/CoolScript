var fs = require("fs");
var process = require("process");

var vars = [];
var waiting = false;
var linecount = 1;

var compiler = {
    wait: function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    cat: function(toconcat){
        var index = 0;
        var rconcat = toconcat;
        while (index < vars.length){
            if (`${vars[index]}`.includes(toconcat)){
                rconcat = rconcat.replace(vars[index], vars[index]);
            }
            index += 1;
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
            console.log(compiler.cat((line.slice(("console(".length), -2))));
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