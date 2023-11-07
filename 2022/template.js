const fs = require('fs')

function main() {
    let filedata = fs.readFileSync('.txt').toString().split('\r\n\r\n');
}

main();