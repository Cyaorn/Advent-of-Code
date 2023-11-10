const fs = require('fs')

function printGrid(grid, x, y, dx, dy) {
    for (i = 0; i < grid.length; i++) {
        out = '';
        for (j = 0; j < grid[i].length; j++) {
            if (i === y && j === x) {
                out += 'H';
            } else if (i === y + dy && j === x + dx) {
                out += 'T';
            } else {
                out += '.';
            }
        }
        console.log(out);
    }
    console.log('');
}

function main() {
    let filedata = fs.readFileSync('09.txt').toString().split('\r\n');
    filedata = filedata.map((inst) => 
      inst.split(' ').map((token, i) => 
        i === 1 ? parseInt(token) : token
    ));
    // console.log(filedata);

    // want to get max dimensions of grid first
    let max_up = 0;
    let max_right = 0;
    let current_up = 0;
    let current_right = 0;
    filedata.forEach((inst) => {
        switch (inst[0]) {
            case 'R':
                current_right += inst[1];
                max_right = Math.max(current_right, max_right);
                break;
            case 'U':
                current_up += inst[1];
                max_up = Math.max(current_up, max_up);
                break;
            case 'D':
                current_up -= inst[1];
                max_up = Math.max(Math.abs(current_up), max_up);
                break;
            case 'L':
                current_right -= inst[1];
                max_right = Math.max(Math.abs(current_right), max_right);
                break;
        }
    });
    // console.log(max_up);
    // console.log(max_right);
    max_up++;
    max_right++;

    // instantiate grid for movement
    let dy = 0;
    let dx = 0;
    let head_y = max_up - 1;
    let head_x = max_right - 1;
    let grid = Array.from(Array(max_up * 2), _ => new Array());
    for (i = 0; i < max_up; i++) {
        for (j = 0; j < max_right * 2; j++) {
            grid[i].push(0);
        }
    }
    console.log(grid);

    // calculate rope movements
    filedata.forEach((inst) => {
        // console.log(inst);
        for (k = 0; k < inst[1]; k++) {
            // same switch statement as before to parse head movement
            if (inst[0] === 'R') {
                head_x++;
                dx--;
            } else if (inst[0] === 'U') {
                head_y--; // invert y value because start is in bottom left
                dy++;
            } else if (inst[0] === 'D') {
                head_y++;
                dy--;
            } else if (inst[0] === 'L') {
                head_x--;
                dx++;
            }

            // adjust distances of tail to keep it close to the head
            if (Math.abs(dx) + Math.abs(dy) > 2) { // if tail is a knight's move away
                // if dx or dy were originally negative, will adjust value to remain negative
                // also adjusts values such that tail follows diagonally in such a case
                dx = (Math.abs(dx) - 1) * (dx / Math.abs(dx)); 
                dy = (Math.abs(dy) - 1) * (dy / Math.abs(dy));
            } else if (Math.abs(dy) >= 2) {
                dy = (Math.abs(dy) - 1) * (dy / Math.abs(dy));
            } else if (Math.abs(dx) >= 2) {
                dx = (Math.abs(dx) - 1) * (dx / Math.abs(dx));
            }
            grid[head_y + dy][head_x + dx] = 1;
            // console.log(`${k}, dx: ${dx}, dy: ${dy}`);
            // printGrid(grid, head_x, head_y, dx, dy);
        }
    });
    let count = 0;
    count = grid.reduce((acc1, row) => 
        acc1 + row.reduce((acc2, spot) => acc2 + spot, 0), 0);
    console.log(count);
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('09.txt').toString().split('\r\n');
    filedata = filedata.map((inst) => 
      inst.split(' ').map((token, i) => 
        i === 1 ? parseInt(token) : token
    ));
    // console.log(filedata);

    // want to get max dimensions of grid first
    let max_up = 0;
    let max_right = 0;
    let current_up = 0;
    let current_right = 0;
    filedata.forEach((inst) => {
        switch (inst[0]) {
            case 'R':
                current_right += inst[1];
                max_right = Math.max(current_right, max_right);
                break;
            case 'U':
                current_up += inst[1];
                max_up = Math.max(current_up, max_up);
                break;
            case 'D':
                current_up -= inst[1];
                max_up = Math.max(Math.abs(current_up), max_up);
                break;
            case 'L':
                current_right -= inst[1];
                max_right = Math.max(Math.abs(current_right), max_right);
                break;
        }
    });
    // console.log(max_up);
    // console.log(max_right);
    max_up++;
    max_right++;

    // instantiate grid for movement
    let dy = 0;
    let dx = 0;
    let head_y = max_up - 1;
    let head_x = max_right - 1;
    let grid = Array.from(Array(max_up * 2), _ => new Array());
    for (i = 0; i < max_up; i++) {
        for (j = 0; j < max_right * 2; j++) {
            grid[i].push(0);
        }
    }
    console.log(grid);

    // calculate rope movements
    filedata.forEach((inst) => {
        // console.log(inst);
        for (k = 0; k < inst[1]; k++) {
            // same switch statement as before to parse head movement
            if (inst[0] === 'R') {
                head_x++;
                dx--;
            } else if (inst[0] === 'U') {
                head_y--; // invert y value because start is in bottom left
                dy++;
            } else if (inst[0] === 'D') {
                head_y++;
                dy--;
            } else if (inst[0] === 'L') {
                head_x--;
                dx++;
            }

            // adjust distances of tail to keep it close to the head
            if (Math.abs(dx) + Math.abs(dy) > 2) { // if tail is a knight's move away
                // if dx or dy were originally negative, will adjust value to remain negative
                // also adjusts values such that tail follows diagonally in such a case
                dx = (Math.abs(dx) - 1) * (dx / Math.abs(dx)); 
                dy = (Math.abs(dy) - 1) * (dy / Math.abs(dy));
            } else if (Math.abs(dy) >= 2) {
                dy = (Math.abs(dy) - 1) * (dy / Math.abs(dy));
            } else if (Math.abs(dx) >= 2) {
                dx = (Math.abs(dx) - 1) * (dx / Math.abs(dx));
            }
            grid[head_y + dy][head_x + dx] = 1;
            // console.log(`${k}, dx: ${dx}, dy: ${dy}`);
            // printGrid(grid, head_x, head_y, dx, dy);
        }
    });
    let count = 0;
    count = grid.reduce((acc1, row) => 
        acc1 + row.reduce((acc2, spot) => acc2 + spot, 0), 0);
    console.log(count);
} */

main();