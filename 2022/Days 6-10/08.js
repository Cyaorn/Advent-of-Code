const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('08.txt').toString().split('\r\n');
    const rows = filedata.length;
    const cols = filedata[0].length;

    // compile input file into parseable array
    let trees = new Array();
    filedata.forEach((row, i) => {
        current = new Array();
        Array.from(row).forEach((height, j) => {
            current.push(parseInt(height));
        });
        trees.push(current);
    });
    // console.log(trees);

    // cringe O(n^3) solution
    max_score = 0;
    for (i = 1; i < rows - 1; i++) {
        for (j = 1; j < cols - 1; j++) {
            n = 1;
            w = 1;
            e = 1;
            s = 1;
            while (trees[i][j] > trees[i-n][j] && i - n > 0) {
                n++;
            }
            while (trees[i][j] > trees[i][j-w] && j - w > 0) {
                w++;
            }
            while (trees[i][j] > trees[i][j+e] && j + e < cols - 1) {
                e++;
            }
            while (trees[i][j] > trees[i+s][j] && i + s < rows - 1) {
                s++;
            }
            max_score = Math.max(max_score, n * w * e * s);
        }
    }
    console.log(max_score);
}

/* Part 1, solution is definitely inefficient there's probably a way to count visible trees while 
construction the DP array instead of just construction first, searching later

function main() {
    let filedata = fs.readFileSync('08.txt').toString().split('\r\n');
    const rows = filedata.length;
    const cols = filedata[0].length;
    const directions = ['N', 'W', 'E', 'S'];

    // compile input file into parseable array
    let trees = new Array();
    filedata.forEach((row, i) => {
        current = new Array();
        Array.from(row).forEach((height, j) => {
            current.push(parseInt(height));
        });
        trees.push(current);
    });
    // console.log(trees);

    // generate DP grid, each spot in the array will hold an object with attributes representing the max heights coming from a particular
    // direction
    let max_heights = Array.from(Array(rows), _ => new Array());
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            max_heights[i].push({});
        }
    }
    // console.log(max_heights);
    // initalize max heights from the north for top row
    for (i = 0; i < cols; i++) {
        max_heights[0][i].N = trees[0][i];
    }
    // heights from west
    for (i = 0; i < rows; i++) {
        max_heights[i][0].W = trees[i][0];
    }
    // heights from east
    for (i = 0; i < rows; i++) {
        max_heights[i][cols - 1].E = trees[i][cols - 1];
    }
    // heights from south
    for (i = 0; i < cols; i++) {
        max_heights[rows - 1][i].S = trees[rows - 1][i];
    }

    // derive inner values from nearest outmost value in whichever direction

    // North heights
    for (i = 1; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            max_heights[i][j].N = Math.max(max_heights[i-1][j].N, trees[i][j]);
        }
    }

    // West heights
    for (j = 1; j < cols; j++) {
        for (i = 0; i < rows; i++) {
            max_heights[i][j].W = Math.max(max_heights[i][j-1].W, trees[i][j]);
        }
    }

    // East heights
    for (j = cols - 2; j >= 0; j--) {
        for (i = 0; i < rows; i++) {
            max_heights[i][j].E = Math.max(max_heights[i][j+1].E, trees[i][j]);
        }
    }

    // South heights
    for (i = rows - 2; i >= 0; i--) {
        for (j = 0; j < cols; j++) {
            max_heights[i][j].S = Math.max(max_heights[i+1][j].S, trees[i][j]);
        }
    }
    
    console.log(max_heights);
    console.log(max_heights.map((row) => row.map((h) => h.N)));
    console.log(max_heights.map((row) => row.map((h) => h.W)));
    console.log(max_heights.map((row) => row.map((h) => h.E)));
    console.log(max_heights.map((row) => row.map((h) => h.S)));
    
    // compare heights to inner trees
    let count = (rows * 2) + (cols * 2) - 4; // add up all side lengths, subtract overlap for 4 corners
    for (i = 1; i < rows - 1; i++) {
        for (j = 1; j < cols - 1; j++) {
            if (max_heights[i-1][j].N < trees[i][j] ||
              max_heights[i][j-1].W < trees[i][j] ||
              max_heights[i][j+1].E < trees[i][j] ||
              max_heights[i+1][j].S < trees[i][j]) {
                count++;
            }
        }
    }
    console.log(count);
} */

main();