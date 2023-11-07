const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('02.txt').toString().split('\r\n');
    const order = {'A': 1, 'X': 1, 'B': 2, 'Y': 2, 'C': 3, 'Z': 3};
    let score = 0;
    let outcome = 0;
    filedata.forEach((round) => {
        choices = round.split(' ');
        outcome = order[choices[0]] + order[choices[1]] - 2; // selected option is -1 on loss, +1 on win relative to opp.
        outcome = outcome == 0 ? 3 : outcome; // Rock -> 1, Paper -> 2, Scissors -> 3
        outcome = outcome == 4 ? 1 : outcome; // Rock could also be 4 on a win against C
        score += outcome + ((order[choices[1]] - 1) * 3);
    });
    console.log(score);
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('02.txt').toString().split('\r\n');
    const order = {'A': 1, 'X': 1, 'B': 2, 'Y': 2, 'C': 3, 'Z': 3};
    let score = 0;
    let outcome = 0;
    filedata.forEach((round) => {
        choices = round.split(' ');
        outcome = (order[choices[1]] - order[choices[0]] + 3) % 3;
        outcome = outcome == 2 ? 0 : (outcome + 1) * 3; // loss -> 0, draw -> 3, win -> 6
        score += outcome + order[choices[1]];
    });
    console.log(score);
} */

main();