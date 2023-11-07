const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('04.txt').toString().split('\r\n')
      .map((line) => line.split(',')
        .map((pair) => pair.split('-').map(x => parseInt(x))));
    count = 0;
    filedata.forEach((line) => {
        min1 = line[0][0];
        max1 = line[0][1];
        min2 = line[1][0];
        max2 = line[1][1];
        if (!(max1 < min2 && min1 < min2) &&
          !(max2 < min1 && min2 < min1)) {
            count += 1;
        }
    });
    console.log(count);
} 

/* Part 1
function main() {
    let filedata = fs.readFileSync('04.txt').toString().split('\r\n')
      .map((line) => line.split(',')
        .map((pair) => pair.split('-').map(x => parseInt(x))));
    // console.log(filedata);
    count = 0;
    filedata.forEach((line) => {
        if ((line[0][0] <= line[1][0] && line[0][1] >= line[1][1]) ||
          (line[0][0] >= line[1][0] && line[0][1] <= line[1][1])) {
            count += 1;
        }
    });
    console.log(count);
} */

main();