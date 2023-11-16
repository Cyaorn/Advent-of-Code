const fs = require('fs');

function print_grid(grid) {
    grid.forEach((row) => {
        out = '';
        row.forEach((cell) => {
            if (cell < 10 && cell >= 0) {
                out += '_' + cell;
            } else {
                out += '' + cell;
            }
            out += ' ';
        });
        console.log(out);
    });
    console.log();
}

function get_checksum(min_steps) { // returns sum of all values in grid, using to check if things are actually changing
    sum = 0;
    for (a = 0; a < min_steps.length; a++) {
        for (b = 0; b < min_steps[a].length; b++) {
            sum += min_steps[a][b];
        }
    }
    return sum;
}

function get_next_step(grid, min_steps, row, col) { 
    valid = new Array();
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach((mod, k) => {
        new_row = row + mod[0];
        new_col = col + mod[1];
        // check if adj. cell is within bounds
        if (!(new_row < 0 || new_row == grid.length || new_col < 0 || new_col == grid[0].length)) {
            // if adj. cell is within one value of current cell, consider its min_step value
            if (grid[row][col] <= grid[new_row][new_col] + 1) { 
                // check if adj. cell has been reached previously before pushing to valid
                if (min_steps[new_row][new_col] > -1) {
                    valid.push(min_steps[new_row][new_col]);
                }
            }
        }
    });
    if (valid.length === 0) {
        return -1;
    } else {
        return Math.min(...valid) + 1;
    }
}   

function main() {
    let filedata = fs.readFileSync('12.txt').toString().split('\r\n');

    // establish relative values for each letter in the alphabet
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const values = {};
    [...alphabet].forEach((letter, i) => { 
        values[letter] = i;
    });

    // fill in grid with puzzle input
    let grid = new Array();
    let row = new Array();
    let start_x = 0;
    let start_y = 0;
    let end_x = 0;
    let end_y = 0;
    filedata.forEach((line, i) => {
        grid.push(row);
        [...line].forEach((char, j) => {
            if (char === 'S') {
                start_y = i;
                start_x = j;
                grid[i].push(0);
            } else if (char === 'E') {
                end_y = i;
                end_x = j;
                grid[i].push(25);
            } else {
                grid[i].push(values[char]);
            }
        });
        row = new Array();
    });
    // print_grid(grid);

    let min_steps = Array(filedata.length).fill(0).map(_ => (new Array(filedata[0].length)).fill(-1));
    min_steps[start_y][start_x] = 0; 
    let min_steps_next = Array(filedata.length).fill(0).map(_ => (new Array(filedata[0].length)).fill(-1));
    // print_grid(min_steps);
    // pretty sure this is like O(n^4) because it checks the entire array for worst-case every cell in the array
    while (min_steps[end_y][end_x] === -1) {
        // print_grid(min_steps);
        min_steps.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell >= 0) {
                    min_steps_next[i][j] = min_steps[i][j];
                } else {
                    min_steps_next[i][j] = get_next_step(grid, min_steps, i, j);
                }
            });
        });
        min_steps = min_steps_next;
        min_steps_next = Array(filedata.length).fill(0).map(_ => (new Array(filedata[0].length)).fill(-1));
        // console.log(get_checksum(min_steps));
    }
    // print_grid(min_steps)
    console.log(min_steps[end_y][end_x]);
}

main();