const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('01.txt').toString().split('\r\n\r\n');
}

main();