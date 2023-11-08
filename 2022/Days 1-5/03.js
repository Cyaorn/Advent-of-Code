const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('03.txt').toString().split('\r\n');
    let priorities = {};
    " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .forEach((char, i) => {priorities[char] = i});
    total = 0;
    i = 0;
    group_size = 3;
    while (i < filedata.length) {
        sets = Array.apply(null, Array(group_size)).map(_ => new Set());
        for (j = 0; j < group_size; j++) { // filling each set with the items in each rucksack
            for (k = 0; k < filedata[i + j].length; k++) {
                sets[j].add(filedata[i + j].charAt(k));
            }
        }
        total += priorities[
            (sets.reduce( // gets intersection of all sets
                (acc, next) => acc.filter(char => next.has(char)), 
                Array.from(sets[0]) // converts acc value to array for easy access
            ))[0]]; // takes the first value because there should only be one value
        i += group_size;
    }
    console.log(total);
} 

/* Part 1
function main() {
    let filedata = fs.readFileSync('03.txt').toString().split('\r\n');
    let priorities = {};
    " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .forEach((char, i) => {priorities[char] = i});
    total = 0;
    filedata.forEach((rucksack, i) => {
        left = new Set();
        right = new Set();
        for (i = 0; i < rucksack.length / 2; i++) {
            left.add(rucksack.charAt(i));
            right.add(rucksack.charAt(i + rucksack.length / 2));
        };
        left.forEach((char) => {
            if (right.has(char)) {
                // console.log("" + i + ', ' + char);
                total += priorities[char];
            }
        });
    });
    console.log(total);
} */

main();