const fs = require('fs')

function drop_sand(cave) { // return true if sand sticks, false if sand falls off
    const x_drop = 500;
    const y_drop = 0;
    let x = x_drop;
    let y = y_drop;
    if (cave[y][x] !== '.') {
        return false;
    }
    while (y < cave.length - 1) {
        if (cave[y + 1][x] === '.') { // can go straight down
            y++;
        } else if (cave[y + 1][x - 1] === '.') { // can go down-left
            y++;
            x--;
        } else if (cave[y + 1][x + 1] === '.') { // can go down-right
            y++;
            x++;
        } else {
            cave[y][x] = 'o';
            return true;
        }
    }
    return false;
}

function print_cave(cave) {
    for (i = 0; i < cave.length; i++) {
        out = '';
        for (j = 490; j < 510; j++) {
            out += cave[i][j];
        }
        console.log(out, out.length);
    }
}

function main() {
    let filedata = fs.readFileSync('14.txt').toString().split('\r\n');

    // actually need to measure bounds of cave this time
    h = 0;
    w_min = 10000; // arbitrarily large value
    w_max = 0
    filedata.forEach((line) => {
        segments = line.split(' -> ').map(
          (coords) => coords.split(',').map((value) => parseInt(value)));
        h = Math.max(h, segments.reduce((max, segment) => Math.max(max, segment[1]), 0));
        w_min = Math.min(w_min, segments.reduce((min, segment) => Math.min(min, segment[0]), 10000));
        w_max = Math.max(w_max, segments.reduce((max, segment) => Math.max(max, segment[0]), 0));
    })

    let cave = Array(h + 3).fill(0).map(_ => (new Array(w_max + h + 20)).fill('.'));
    for (a = 0; a < cave[h + 2].length; a++) {
        cave[h + 2][a] = '#'; // draw bottom line of cave
    }
    
    filedata.forEach((line) => {
        segments = line.split(' -> ').map(
          (coords) => coords.split(',').map((value) => parseInt(value)));
        segments.forEach((segment, i) => {
            if (i < segments.length - 1) {
                x0 = segment[0];
                x1 = segments[i + 1][0];
                y0 = segment[1];
                y1 = segments[i + 1][1];
                // console.log(x0, y0, x1, y1);
                if (y0 != y1) { // differ by y-value
                    for (j = Math.min(y0, y1); j <= Math.max(y0, y1); j++) {
                        cave[j][x0] = '#';
                    }
                } else { // differ by x-value
                    for (j = Math.min(x0, x1); j <= Math.max(x0, x1); j++) {
                        cave[y0][j] = '#';
                    }
                }
            } 
        });
    });
    // print_cave(cave);

    let sand_count = 0;
    while (drop_sand(cave)) {
        // print_cave(cave);
        sand_count++;
    }
    console.log(sand_count);
}

/* Part 1
function drop_sand(cave) { // return true if sand sticks, false if sand falls off
    const x_drop = 500;
    const y_drop = 0;
    let x = x_drop;
    let y = y_drop;
    while (y < cave.length - 1) {
        if (cave[y + 1][x] === '.') { // can go straight down
            y++;
        } else if (cave[y + 1][x - 1] === '.') { // can go down-left
            y++;
            x--;
        } else if (cave[y + 1][x + 1] === '.') { // can go down-right
            y++;
            x++;
        } else {
            cave[y][x] = 'o';
            return true;
        }
    }
    return false;
}

function main() {
    let filedata = fs.readFileSync('14.txt').toString().split('\r\n');
    // approximations of bounds of cave
    const height = 200;
    const width = 600;
    let cave = Array(height).fill(0).map(_ => (new Array(width)).fill('.'));
    // print_cave(cave);
    filedata.forEach((line) => {
        segments = line.split(' -> ').map(
          (coords) => coords.split(',').map((value) => parseInt(value)));
        segments.forEach((segment, i) => {
            if (i < segments.length - 1) {
                x0 = segment[0];
                x1 = segments[i + 1][0];
                y0 = segment[1];
                y1 = segments[i + 1][1];
                // console.log(x0, y0, x1, y1);
                if (y0 != y1) { // differ by y-value
                    for (j = Math.min(y0, y1); j <= Math.max(y0, y1); j++) {
                        cave[j][x0] = '#';
                    }
                } else { // differ by x-value
                    for (j = Math.min(x0, x1); j <= Math.max(x0, x1); j++) {
                        cave[y0][j] = '#';
                    }
                }
            } 
        });
    });
    let sand_count = 0;
    while (drop_sand(cave)) {
        sand_count++;
    }
    console.log(sand_count);
}
*/

main();