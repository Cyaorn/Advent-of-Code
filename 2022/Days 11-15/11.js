const fs = require('fs')

class Monkey {
    constructor(objects, operation, divisor, true_case, false_case) {
        this.objects = objects;
        this.operation = operation;
        this.divisor = divisor;
        this.true_case = true_case;
        this.false_case = false_case;
        this.activity = 0;
    }
}

function generateFunction(tokens) { // function to generate a new function that takes in 1 parameter
    switch (tokens[1]) {
        case '*':
            return ((x) => x * (tokens[2] === 'old' ? x : parseInt(tokens[2])));
        case '+':
            return ((x) => x + (tokens[2] === 'old' ? x : parseInt(tokens[2])));
        default:
            return;
    }
}

function gcd(a, b) { 
    for (let temp = b; b !== 0;) { 
        b = a % b; 
        a = temp; 
        temp = b; 
    } 
    return a; 
} 
  
function get_lcm(a, b) { // code snippet courtesy of Geeksforgeeks.com
    return (a * b) / gcd(a, b); 
} 

function main() {
    let filedata = fs.readFileSync('11.txt').toString().split('\r\n\r\n');
    let monkeys = [];
    // biggest issue with this problem will be handling the input (since I would rather not just hard-code the parameters)
    filedata.forEach((monkey) => {
        lines = monkey.split('\r\n');
        // retrieve starting objects
        objects = lines[1].substring('  Starting items: '.length).split(', ');
        objects = objects.map((o) => parseInt(o));

        // retrieve operation
        operation_tokens = lines[2].substring('  Operation: new = '.length).split(' ');
        operation = generateFunction(operation_tokens);

        // retrieve divisor and true/false cases
        divisor = parseInt(lines[3].substring('  Test: divisible by '.length));
        true_case = parseInt(lines[4].substring('    If true: throw to monkey '.length));
        false_case = parseInt(lines[5].substring('    If false: throw to monkey '.length));
        
        monkeys.push(new Monkey(objects, operation, divisor, true_case, false_case));
    });
    const lcm = monkeys.map(m => m.divisor).reduce((acc, d) => get_lcm(acc, d), 1);
    current_worry = 0;
    for (round = 0; round < 10000; round++) {
        for (i = 0; i < monkeys.length; i++) {
            // console.log(`\nMonkey ${i}`);
            while(monkeys[i].objects.length > 0) {
                current_obj = monkeys[i].objects.shift();
                // console.log(`Current object: ${current_obj}`);
                current_worry = monkeys[i].operation(current_obj);
                // got confused about this but basically instead of dividing by 3 you divide by the LCM of all the monkey divisors
                current_worry = current_worry % lcm;
                if (current_worry % monkeys[i].divisor === 0) {
                    // console.log(`Throwing ${current_worry} to Monkey ${monkeys[i].true_case}`);
                    monkeys[monkeys[i].true_case].objects.push(current_worry);
                } else {
                    // console.log(`Throwing ${current_worry} to Monkey ${monkeys[i].false_case}`);
                    monkeys[monkeys[i].false_case].objects.push(current_worry);
                }
                monkeys[i].activity++;
            }
            if (round === 0 || round === 19) {
                // console.log(`Monkey ${i} Activity: ${monkeys[i].activity}`);
            }
        }
        // console.log(monkeys.map(m => m.objects));
    }
    monkeys.sort((a, b) => b.activity - a.activity);
    console.log(monkeys[0].activity * monkeys[1].activity);
}

/* Part 1
function main() {
    let filedata = fs.readFileSync('11.txt').toString().split('\r\n\r\n');
    let monkeys = [];
    // biggest issue with this problem will be handling the input (since I would rather not just hard-code the parameters)
    filedata.forEach((monkey) => {
        lines = monkey.split('\r\n');
        // retrieve starting objects
        objects = lines[1].substring('  Starting items: '.length).split(', ');
        objects = objects.map((o) => parseInt(o));

        // retrieve operation
        operation_tokens = lines[2].substring('  Operation: new = '.length).split(' ');
        operation = generateFunction(operation_tokens);

        // retrieve divisor and true/false cases
        divisor = parseInt(lines[3].substring('  Test: divisible by '.length));
        true_case = parseInt(lines[4].substring('    If true: throw to monkey '.length));
        false_case = parseInt(lines[5].substring('    If false: throw to monkey '.length));
        
        monkeys.push(new Monkey(objects, operation, divisor, true_case, false_case));
    });
    current_worry = 0;
    for (round = 0; round < 20; round++) {
        for (i = 0; i < monkeys.length; i++) {
            // console.log(`\nMonkey ${i}`);
            while(monkeys[i].objects.length > 0) {
                current_obj = monkeys[i].objects.shift();
                // console.log(`Current object: ${current_obj}`);
                current_worry = monkeys[i].operation(current_obj);
                current_worry = Math.floor(current_worry / 3);
                if (current_worry % monkeys[i].divisor === 0) {
                    // console.log(`Throwing ${current_worry} to Monkey ${monkeys[i].true_case}`);
                    monkeys[monkeys[i].true_case].objects.push(current_worry);
                } else {
                    // console.log(`Throwing ${current_worry} to Monkey ${monkeys[i].false_case}`);
                    monkeys[monkeys[i].false_case].objects.push(current_worry);
                }
                monkeys[i].activity++;
            }
            // console.log(`Monkey ${i} Activity: ${monkeys[i].activity}`);
        }
        // console.log(monkeys.map(m => m.objects));
    }
    monkeys.sort((a, b) => b.activity - a.activity);
    console.log(monkeys[0].activity * monkeys[1].activity);
} */

main();