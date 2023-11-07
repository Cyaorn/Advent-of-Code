const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('01.txt').toString().split('\r\n\r\n');
    let max = [-1, -1, -1];
    let current = 0;
    filedata.forEach((elf) => {
        current = elf.split('\r\n').reduce((acc, i) => acc + parseInt(i), 0);
        insert(max, current);
    });
    console.log(max.reduce((acc, i) => acc + i, 0));
}

function insert(ary, elem) { // in-place insertion of the next max value, preserving desc order
    for (i = 0; i < ary.length; i++) {
        if (ary[i] < elem) {
            for (j = ary.length - 1; j > i; j--) {
                ary[j] = ary[j - 1];
            }
            ary[i] = elem;
            return;
        }
    }
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
