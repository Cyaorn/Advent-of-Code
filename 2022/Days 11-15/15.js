const fs = require('fs')

// IDEA FOR PART 2:
// Just do the same algorithm, but for every target_x and target_y between 0 and 4 mil,
// find whichever x, y values are such that there are 2 intervals (unless the space is on the edge)

function merge_intervals(intervals) { // assumes array of interval pairs sorted by first element in asc order
    let out_intervals = new Array();
    current_min = intervals[0][0];
    current_max = intervals[0][1];
    n = 1;
    while (n < intervals.length) {
        // console.log(n, ': ', current_min, current_max);
        if (current_max + 1 < intervals[n][0]) { // if endpoint is out of range of next start point, continue
            // console.log("Pushing current interval");
            out_intervals.push([current_min, current_max]);
            current_min = intervals[n][0];
            current_max = intervals[n][1];
        } else {
            current_max = Math.max(current_max, intervals[n][1]);
            // console.log("Expanded interval to", current_min, current_max);
        }
        n++;
    }
    out_intervals.push([current_min, current_max]);
    return out_intervals;
}

function main() {
    let filedata = fs.readFileSync('15.txt').toString().split('\r\n');
    const y_bound = 4000000;
    let intervals = new Array(); // store intervals of values because keeping track of the array explicitly is too big
    let sxs = new Set(); // set of sensors
    filedata.forEach((line) => {
        coords = line.substring('Sensor at '.length)
          .split(': closest beacon is at ')
          .map((pair) => 
            pair.substring('x='.length)
              .split(', y=')
              .map(num => parseInt(num)));
        // console.log(coords);
        sx = coords[0][0];
        sy = coords[0][1];
        bx = coords[1][0];
        by = coords[1][1];
        sxs.add({'sx': sx, 'sy': sy, 'range': Math.abs(bx - sx) + Math.abs(by - sy)});
    });
    // console.log(sxs);
    for (y = 0; y <= y_bound; y++) { // for every y-level check if there is a break in the interval
        intervals = new Array();
        sxs.forEach((sensor) => {
            extra = sensor.range - Math.abs(sensor.sy - y);
            // console.log(extra);
            if (extra >= 0) {
                intervals.push([Math.max(sensor.sx - extra, 0), Math.min(sensor.sx + extra, y_bound)]);
            }
        });
        if (intervals.length > 0) { 
            intervals = merge_intervals(intervals.sort((a, b) => a[0] - b[0]));
            if (intervals.length > 1 || intervals[0][0] > 0 || intervals[0][1] < 4000000) {
                let target_x = intervals[0][1] + 1;
                console.log(target_x * 4000000 + y);
                break;
            }
        }
    }
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('15.txt').toString().split('\r\n');
    const target_y = 2000000;
    let intervals = new Array(); // store intervals of values because keeping track of the array explicitly is too big
    let bxs = new Set(); // set of beacons that exist on target_y to remove when calculating the output
    filedata.forEach((line) => {
        coords = line.substring('Sensor at '.length)
          .split(': closest beacon is at ')
          .map((pair) => 
            pair.substring('x='.length)
              .split(', y=')
              .map(num => parseInt(num)));
        // console.log(coords);
        sx = coords[0][0];
        sy = coords[0][1];
        bx = coords[1][0];
        by = coords[1][1];
        dist = Math.abs(bx - sx) + Math.abs(by - sy);
        if (by === target_y) {
            bxs.add(bx);
        } 
        extra = dist - Math.abs(sy - target_y);
        // console.log(extra);
        if (extra >= 0) {
            intervals.push([sx - extra, sx + extra]);
        }
    });
    // console.log(bxs);
    intervals = merge_intervals(intervals.sort((a, b) => a[0] - b[0]));
    let count = 0;
    intervals.forEach((interval) => {
        count += interval[1] - interval[0] + 1;
        bxs.forEach(beacon => {
            if (interval[0] <= beacon && beacon <= interval[1]) {
                count--;
            }
        });
    });
    console.log(count);
} */

main();