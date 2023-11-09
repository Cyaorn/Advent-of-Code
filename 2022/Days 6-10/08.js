const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('08sample.txt').toString().split('\r\n');
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
    console.log(trees);

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
    console.log(max_heights);

}

main();