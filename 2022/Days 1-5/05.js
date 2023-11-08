const fs = require('fs')

function main() {
    // filedata: [0] -> crate structure, [1] -> instructions
    let filedata = fs.readFileSync('05.txt').toString().split('\r\n\r\n');
    let cratedata = filedata[0].split('\r\n');
    let instructions = filedata[1].split('\r\n');

    // parsing crates
    let crates = Array.apply(null, new Array(9)).map(_ => new Array()); // arbitrarily large-ish

    // actual letters for each crate located at indices 1, 5, 9, etc. 
    for (i = cratedata.length - 2; i >= 0; i--) { // look at stack of crates from bottom up
        for (j = 1; j < cratedata[i].length; j += 4) {
            if (cratedata[i][j] !== ' ') {
                crates[(j - 1) / 4].push(cratedata[i][j]);
            }
        }
    }   

    // parsing instructions
    instructions = instructions.map((inst) => {
        let obj = {};
        inst = inst.substring(5).split(/ from | to /); // regex for ' from ' or ' to ' as separators
        obj.count = parseInt(inst[0]);
        // lower indices by 1 for 0-indexed array
        obj.from = parseInt(inst[1]) - 1; 
        obj.to = parseInt(inst[2]) - 1;
        return obj;
    });
    let aux = new Array();
    instructions.forEach((inst) => {
        for (k = 0; k < inst.count; k++) {
            // push crates onto auxiliary stack to invert order
            aux.push(crates[inst.from].pop());
        }
        for (k = 0; k < inst.count; k++) {
            crates[inst.to].push(aux.pop());
        }
    });
    let out = "";
    crates.forEach((stack) => { // remove the top crate from every stack
        out += stack.pop();
    });
    console.log(out);
}

/* Part 1
function main() {
    // filedata: [0] -> crate structure, [1] -> instructions
    let filedata = fs.readFileSync('05.txt').toString().split('\r\n\r\n');
    let cratedata = filedata[0].split('\r\n');
    let instructions = filedata[1].split('\r\n');

    // parsing crates
    let crates = Array.apply(null, new Array(9)).map(_ => new Array()); // arbitrarily large-ish

    // actual letters for each crate located at indices 1, 5, 9, etc. 
    for (i = cratedata.length - 2; i >= 0; i--) { // look at stack of crates from bottom up
        for (j = 1; j < cratedata[i].length; j += 4) {
            if (cratedata[i][j] !== ' ') {
                crates[(j - 1) / 4].push(cratedata[i][j]);
            }
        }
    }   

    // parsing instructions
    instructions = instructions.map((inst) => {
        let obj = {};
        inst = inst.substring(5).split(/ from | to /); // regex for ' from ' or ' to ' as separators
        obj.count = parseInt(inst[0]);
        // lower indices by 1 for 0-indexed array
        obj.from = parseInt(inst[1]) - 1; 
        obj.to = parseInt(inst[2]) - 1;
        return obj;
    });
    instructions.forEach((inst) => {
        for (k = 0; k < inst.count; k++) {
            // place the top of the source stack onto the destination stack
            crates[inst.to].push(crates[inst.from].pop());
        }
    });
    let out = "";
    crates.forEach((stack) => { // remove the top crate from every stack
        out += stack.pop();
    });
    console.log(out);
} */

main();