const fs = require('fs');

function print_image(image) {
    image.forEach((row, i) => {
        if (i !== 0) { // skip first row which is a dummy array
            console.log(row.reduce((acc, char) => acc + char, ''));
        }
    })
}

function main() {
    let filedata = fs.readFileSync('10.txt').toString().split('\r\n');
    cycles = 0;
    pipe = 0; // value that will be stored for any pending addx ops
    reg = 1; // initial register value is 1
    ci = 0; // current instruction
    image = []; // array of arrays for the entire rendered image
    row = []
    /*
    Order of Operations:
    - check if new row needs to be started
    - if no instruction in progress, retrieve next instruction
    - check if sprite is over current CRT position, draw CRT pixel
    - complete pending addx operation at the end (i.e: move sprite)
    */
    while (true) {
        if (cycles % 40 === 0) {
            image.push(row);
            row = [];
        }
        cycles++;
        if (ci >= filedata.length && pipe === 0) {
            break;
        }
        inst = filedata[ci];
        console.log(`Cycle ${cycles} | Register Value: ${reg} | Current Inst: ${ci}`);
        // compare sprite position to CRT position
        pixel = cycles % 40 - 1;
        if (reg - 1 === pixel || reg === pixel || reg + 1 === pixel) {
            row.push('#');
        } else {
            row.push('.');
        }
        if (!pipe && ci < filedata.length) {
            switch (inst.substring(0, 4)) {
                case 'noop':
                    console.log(`No-Op detected, skipping`);
                    break;
                case 'addx':
                    pipe = parseInt(inst.split(' ')[1]);
                    console.log(`Starting addx operation, value ${pipe}`);
                    break;
            }
            ci++;
        } else if (pipe) {
            reg += pipe;
            console.log(`Completing addx operation, Register value: ${reg}`);
            pipe = 0;
        }
    }
    console.log(`Cycle ${cycles} | Register Value: ${reg}`);
    print_image(image);
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('10.txt').toString().split('\r\n');
    cycles = 0;
    pipe = 0; // value that will be stored for any pending addx ops
    reg = 1; // initial register value is 1
    signal = 0; // signal strength
    ci = 0; // current instruction
    
    Order of Operations:
    - if no instruction in progress, retrieve next instruction
    - check for signal strength if cycle number is correct
    - complete pending addx operation at the end
    
    while (true) {
        cycles++;
        if (ci >= filedata.length && pipe === 0) {
            break;
        }
        inst = filedata[ci];
        if ((cycles - 20) % 40 === 0) {
            signal += cycles * reg;
            console.log(`Cycle: ${cycles} | Signal Strength: ${cycles * reg}`);
        }
        console.log(`Cycle ${cycles} | Register Value: ${reg} | Current Inst: ${ci}`);
        if (!pipe && ci < filedata.length) {
            switch (inst.substring(0, 4)) {
                case 'noop':
                    console.log(`No-Op detected, skipping`);
                    break;
                case 'addx':
                    pipe = parseInt(inst.split(' ')[1]);
                    console.log(`Starting addx operation, value ${pipe}`);
                    break;
            }
            ci++;
        } else if (pipe) {
            reg += pipe;
            console.log(`Completing addx operation, Register value: ${reg}`);
            pipe = 0;
        }
    }
    console.log(`Cycle ${cycles} | Register Value: ${reg}`);
    console.log(signal);
} */

main();