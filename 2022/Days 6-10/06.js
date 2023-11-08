const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('06.txt').toString();
    let chars;
    for (i = 0; i < filedata.length - 14; i++) {
        chars = new Set(filedata.substring(i, i + 14));
        if (Array.from(chars).length === 14) {
            console.log(chars);
            console.log(i + 14);
            break;
        }
    }
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('06.txt').toString();
    let chars;
    for (i = 0; i < filedata.length - 4; i++) {
        chars = new Set(filedata.substring(i, i + 4));
        if (Array.from(chars).length === 4) {
            console.log(chars);
            console.log(i + 4);
            break;
        }
    }
} */

main();