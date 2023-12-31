const fs = require('fs')

function compare(left, right) { // return 1 if left < right, 0 if equal, -1 if right < left
    if (Array.isArray(left)) {
        if (Array.isArray(right)) {
            let i = 0;
            if (i == left.length) { // if left has run out of elements
                if (i == right.length) { // both arrays are same length
                    return 0;
                }
                return 1; // else left has less elements; correct order
            } 
            if (i == right.length) { // only if right has strictly less than left; wrong order
                return -1;
            }
            let comp = compare(left[i], right[i]);
            while (comp == 0) {
                i++;
                // not sure how to avoid repeating this code for a preliminary check
                if (i == left.length) { // if left has run out of elements
                    if (i == right.length) { // both arrays are same length
                        return 0;
                    }
                    return 1; // else left has less elements; correct order
                } 
                if (i == right.length) { // only if right has strictly less than left; wrong order
                    return -1;
                }
                comp = compare(left[i], right[i]);
            }
            return comp;
        } else { // left is array, right isn't
            return compare(left, [right]);
        }
    } else { // left is not an array
        if (Array.isArray(right)) {
            return compare([left], right);
        } else {
            if (left < right) {
                return 1;
            } else if (left == right) {
                return 0;
            } else {
                return -1;
            }
        }
    }
}

function main() {
    let filedata = fs.readFileSync('13.txt').toString().split('\r\n\r\n');
    let packets = [];
    filedata.forEach((pair, index) => {
        [left, right] = pair.split('\r\n').map(x => JSON.parse(x)); 
        packets.push(left);
        packets.push(right);
    });
    packets.push([[2]]);
    packets.push([[6]]);
    packets = packets.sort((a, b) => compare(a, b) * -1);
    let divider2 = -1;
    let divider6 = -1;
    packets.forEach((packet, index) => {
        if (compare(packet, [[2]]) === 0) {
            divider2 = index + 1;
        } else if (compare(packet, [[6]]) === 0) {
            divider6 = index + 1;
        }
    });
    console.log(divider2 * divider6);
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('13.txt').toString().split('\r\n\r\n');
    let count = 0;
    filedata.forEach((pair, index) => {
        [left, right] = pair.split('\r\n').map(x => JSON.parse(x)); 
        count += compare(left, right) === -1 ? 0 : (index + 1);
    });
    console.log(count);
} */

main();