const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('01.txt').toString().split('\r\n\r\n');
    let max = [-1, -1, -1];
    let current = 0;
    filedata.forEach((elf) => {
        current = elf.split('\r\n').reduce((acc, i) => acc + parseInt(i), 0);
        if (max[0] < current) {
            max[2] = max[1];
            max[1] = max[0];
            max[0] = current;
        } else if (max[1] < current) {
            max[2] = max[1];
            max[1] = current;
        } else if (max[2] < current) {
            max[2] = current;
        }
    });
    console.log(max.reduce((acc, i) => acc + i, 0));
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('01.txt').toString().split('\r\n\r\n');
    let max = -1
    filedata.forEach((elf) => {
        max = Math.max(max, elf.split('\r\n').reduce((acc, i) => acc + parseInt(i), 0));
    });
    console.log(max);
} */

main();
