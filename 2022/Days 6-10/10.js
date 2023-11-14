const fs = require('fs');

function main() {
    let filedata = fs.readFileSync('10.txt').toString().split('\r\n');
    cycles = 0;
    pipe = 0; // value that will be stored for any pending addx ops
    reg = 1; // initial register value is 1
    signal = 0; // signal strength
    ci = 0; // current instruction
    /*
    Order of Operations:
    - if no instruction in progress, retrieve next instruction
    - check for signal strength if cycle number is correct
    - complete pending addx operation at the end
    */
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
}

main();