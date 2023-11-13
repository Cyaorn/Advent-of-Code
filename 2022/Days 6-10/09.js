const fs = require('fs')

/*
Main takeaways from this problem
- DO NOT use the same variables for nested for loops, even in different scopes, it kinda messes things up
- sometimes you just gotta buckle down and write out what you want to happen by hand, and then go from there
- I kept in all the comments for Part 2 to showcase a bit of the madness
*/

function printGrid(grid, x, y, dx, dy) {
    dx_sum = dx.reduce((acc, x, l) => {acc.push(acc[l] + x); return acc;}, [0]).slice(1);
    dy_sum = dy.reduce((acc, y, l) => {acc.push(acc[l] + y); return acc;}, [0]).slice(1);
    placed = false;
    for (m = 0; m < grid.length; m++) {
        out = '';
        for (n = 0; n < grid[m].length; n++) {
            if (m === y && n === x) {
                out += 'H';
            } else {
                for (p = 0; p < dx_sum.length; p++) {
                    if (m === y + dy_sum[p] && n === x + dx_sum[p] && !placed) {
                        out += (p + 1).toString();
                        placed = true;
                    }
                }
                if (!placed) {
                    out += '.';
                }
                placed = false;
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

    // instantiate grid for movement, dx[0-8] -> tails 1-9
    let dx = Array.from(new Array(9), _ => 0);
    let dy = Array.from(new Array(9), _ => 0);
    // for later use
    let ddx = 0;
    let ddy = 0; 
    let head_y = max_up - 1;
    let head_x = max_right - 1;
    let grid = Array.from(new Array(max_up * 2), _ => new Array());
    for (i = 0; i < max_up * 2; i++) {
        for (j = 0; j < max_right * 2; j++) {
            grid[i].push(0);
        }
    }
    // console.log(grid);

    // calculate rope movements
    filedata.forEach((inst) => {
        console.log(inst);
        // calculate head movement first for each single step, including first tail segment
        for (k = 0; k < inst[1]; k++) {
            if (inst[0] === 'R') {
                head_x++;
                dx[0]--;
            } else if (inst[0] === 'U') {
                head_y--; // invert y value because start is in bottom left
                dy[0]++;
            } else if (inst[0] === 'D') {
                head_y++;
                dy[0]--;
            } else if (inst[0] === 'L') {
                head_x--;
                dx[0]++;
            }
            // record distances adjusted to use for the next tail segment
            oldx = dx[0];
            oldy = dy[0];
            // console.log(`${Math.abs(dx[0]) + Math.abs(dy[0]) > 2}, ${Math.abs(dy[0]) >= 2}, ${Math.abs(dx[0]) >= 2}`);
            // adjust distances of first tail segment to keep it close to the head
            // any changes in distance are propagated to the next segment
            if (Math.abs(dx[0]) + Math.abs(dy[0]) > 2) { // if tail is a knight's move away
                // if dx or dy were originally negative, will adjust value to remain negative
                // also adjusts values such that tail follows diagonally in such a case
                dx[0] = (Math.abs(dx[0]) - 1) * (dx[0] / Math.abs(dx[0])); 
                dy[0] = (Math.abs(dy[0]) - 1) * (dy[0] / Math.abs(dy[0]));
                ddx = oldx - dx[0]; // old - new = difference
                ddy = oldy - dy[0];
            } else if (Math.abs(dy[0]) >= 2) {
                dy[0] = (Math.abs(dy[0]) - 1) * (dy[0] / Math.abs(dy[0]));
                ddy = oldy - dy[0]; 
                ddx = 0;
            } else if (Math.abs(dx[0]) >= 2) {
                dx[0] = (Math.abs(dx[0]) - 1) * (dx[0] / Math.abs(dx[0]));
                ddx = oldx - dx[0];
                ddy = 0;
                // console.log(`New dx[0]: ${dx[0]}`);
            } else {
                ddx = 0;
                ddy = 0;
            }
            dx[1] += ddx;
            dy[1] += ddy;
            /*
            console.log(`Head operation: dx: ${dx}, dy: ${dy}`);
            console.log(`Head ddx: ${ddx}`);
            console.log(`Head ddy: ${ddy}`);
            console.log();
            */
            // calculate movements of the rest of the segments based on movement of previous segment
            for (i = 1; i < dx.length; i++) { // dx.length interchangeable with dy.length
                if (Math.abs(dx[i]) <= 1 && Math.abs(dy[i]) <= 1) { // if propagated difference is within range, segment will not move
                    // console.log("BREAKING TAIL OPERATIONS\n");
                    break;
                }
                // console.log(`i = ${i}:\n`);
                oldx = dx[i];
                oldy = dy[i];
                /*
                console.log(`BEFORE ADJUSTMENT: dx[${i}]: ${oldx}, dy[${i}]: ${oldy}`);
                console.log(`${Math.abs(dx[i]) + Math.abs(dy[i]) > 2}, ${Math.abs(dy[i]) >= 2}, ${Math.abs(dx[i]) >= 2}`);
                */
                // adjust distances of tail segment to keep it close to the segment ahead of it
                if (Math.abs(dx[i]) + Math.abs(dy[i]) > 2) { // if tail is a knight's move away
                    // if dx or dy were originally negative, will adjust value to remain negative
                    // also adjusts values such that tail follows diagonally in such a case
                    dx[i] = (Math.abs(dx[i]) - 1) * (dx[i] / Math.abs(dx[i])); 
                    dy[i] = (Math.abs(dy[i]) - 1) * (dy[i] / Math.abs(dy[i]));
                    ddx = oldx - dx[i]; // old - new = difference
                    ddy = oldy - dy[i];
                } else if (Math.abs(dy[i]) >= 2) {
                    dy[i] = (Math.abs(dy[i]) - 1) * (dy[i] / Math.abs(dy[i]));
                    ddy = oldy - dy[i];
                    ddx = 0;
                } else if (Math.abs(dx[i]) >= 2) {
                    dx[i] = (Math.abs(dx[i]) - 1) * (dx[i] / Math.abs(dx[i]));
                    ddx = oldx - dx[i]; // old - new = difference
                    ddy = 0;
                } else {
                    ddx = 0;
                    ddy = 0;
                }
                // console.log(`AFTER ADJUSTMENT: dx[${i}]: ${dx[i]}, dy[${i}]: ${dy[i]}`);
                if (i < dx.length - 1) {
                    dx[i+1] += ddx;
                    dy[i+1] += ddy;
                }
                /*
                console.log(`Tail operation ${i} | dx: ${dx}, dy: ${dy}`);
                console.log(`Tail ${i} | ddx: ${ddx}, ddy: ${ddy}`);
                console.log('');
                */
            }

            // mark new spot on grid for last segment
            dx9 = dx.reduce((acc, x) => acc + x, 0);
            dy9 = dy.reduce((acc, y) => acc + y, 0);
            // console.log(`dx9: ${dx9}, dy9: ${dy9}`);
            grid[head_y + dy9][head_x + dx9] = 1;
            // console.log(`${k}\ndx: ${dx}\ndy: ${dy}`);
            // printGrid(grid, head_x, head_y, dx, dy);
        }
    });
    let count = 0;
    count = grid.reduce((acc1, row) => 
        acc1 + row.reduce((acc2, spot) => acc2 + spot, 0), 0);
    console.log(count);
}

/* Part 1
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
} */

main();