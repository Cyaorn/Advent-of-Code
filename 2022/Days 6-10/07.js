const fs = require('fs')

const filetype = {
    File: 0,
    Directory: 1
}

class FileTree {
    constructor(filetype, size, filename, parent) {
        this.filetype = filetype;
        this.size = size;
        this.filename = filename;
        this.parent = parent;
        this.children = new Array();
    }

    getFileSize() {
        if (this.filetype === filetype.File) {
            return this.size;
        }
        return this.children.reduce((acc, next) => acc + next.getFileSize(), 0);
    }

    printTree(spacer=0) {
        console.log(
          ' '.repeat(spacer) + 
          (this.filetype ? "Directory" : "File") + 
          ': ' + this.filename + 
          `, ${this.filetype ? '' : `size: ${this.size}`}`
        );
        this.children.forEach((child) => {
            child.printTree(spacer + 2);
        })
    }
}

function main() {
    let filedata = fs.readFileSync('07.txt').toString().split('\r\n');
    let root = new FileTree(filetype.Directory, 0, '/', null);
    let current = root;
    let i = 1; // first line is the only '$ cd /' command

    // build FileTree
    while (i < filedata.length) {
        // console.log(`Line ${i}: ` + filedata[i]);
        if (filedata[i].substring(0, 4) === '$ ls') { // establish children
            // console.log(`ls command detected, showing contents of ${current.filename}`);
            i++;
            while (i < filedata.length && filedata[i].substring(0, 2) !== '$ ') { // while there are no commands next, build tree structure
                // console.log(filedata[i]);
                if (filedata[i].substring(0, 4) === 'dir ') { // child directory
                    current.children.push(
                      new FileTree(filetype.Directory, 0, filedata[i].substring(4), current)
                    );
                } else { // split by space, first part is size, second part is name
                    token = filedata[i].split(' ');
                    current.children.push(
                      new FileTree(filetype.File, parseInt(token[0]), token[1], current)
                    );
                }   
                i++;
            }
            // console.log(current.children);
        } else if (filedata[i].substring(0, 5) === '$ cd ') {
            if (filedata[i].substring(5) === '..') {
                // console.log(`Changing directory to ${current.parent.filename}`);
                current = current.parent;
            } else {
                // console.log(`Changing directory to ${filedata[i].substring(5)}`);
                current.children.forEach((child) => { // a bit inefficient, would probably be better with hashing
                    if (child.filename === filedata[i].substring(5)) {
                        current = child;
                    }
                });
            }
            i++; // increment only in this clause because ls command autoincrement already
        }
    }
    // root.printTree();
    const drive_space = 70000000;
    const update_size = 30000000;
    const space_needed = update_size - (drive_space - root.getFileSize());
    console.log(space_needed);
    let directories = new Array();
    compile(root, directories);
    directories.sort((a, b) => a[1] - b[1]);
    console.log(directories.filter((dir) => dir[1] >= space_needed)[0]);
}

// I gave up trying to do a recursive solution because it's easier to just fill an array with
// all of the directories and their sizes
function compile(tree, array) { // still inefficient in the same way
    if (tree.filetype === filetype.File) {
        return;
    }
    tree.children.filter((child) => child.filetype === filetype.Directory)
      .forEach((child) => {
            compile(child, array);
            array.push([child.filename, child.getFileSize()]);
        }
    )
    array.push([tree.filename, tree.getFileSize()]);
}

/* Part 1, uses the same FileTree object
function main() {
    let filedata = fs.readFileSync('07.txt').toString().split('\r\n');
    let root = new FileTree(filetype.Directory, 0, '/', null);
    let current = root;
    let i = 1; // first line is the only '$ cd /' command

    // build FileTree
    while (i < filedata.length) {
        // console.log(`Line ${i}: ` + filedata[i]);
        if (filedata[i].substring(0, 4) === '$ ls') { // establish children
            // console.log(`ls command detected, showing contents of ${current.filename}`);
            i++;
            while (i < filedata.length && filedata[i].substring(0, 2) !== '$ ') { // while there are no commands next, build tree structure
                // console.log(filedata[i]);
                if (filedata[i].substring(0, 4) === 'dir ') { // child directory
                    current.children.push(
                      new FileTree(filetype.Directory, 0, filedata[i].substring(4), current)
                    );
                } else { // split by space, first part is size, second part is name
                    token = filedata[i].split(' ');
                    current.children.push(
                      new FileTree(filetype.File, parseInt(token[0]), token[1], current)
                    );
                }   
                i++;
            }
            // console.log(current.children);
        } else if (filedata[i].substring(0, 5) === '$ cd ') {
            if (filedata[i].substring(5) === '..') {
                // console.log(`Changing directory to ${current.parent.filename}`);
                current = current.parent;
            } else {
                // console.log(`Changing directory to ${filedata[i].substring(5)}`);
                current.children.forEach((child) => { // a bit inefficient, would probably be better with hashing
                    if (child.filename === filedata[i].substring(5)) {
                        current = child;
                    }
                });
            }
            i++; // increment only in this clause because ls command autoincrement already
        }
    }
    root.printTree();

    console.log(traverse(root));
}

function traverse(tree) { // This is very inefficient because it runs getFileSize() for every subdirectory
    if (tree.filetype === filetype.File) {
        return 0;
    }
    out = 0;
    tree.children.filter((child) => child.filetype === filetype.Directory)
      .forEach((child) => {
            out += traverse(child);
        }
    )
    total_size = tree.getFileSize();
    console.log(`Size of directory ${tree.filename}: ${total_size}`);
    if (total_size <= 100000) {
        out += total_size;
    }
    return out;
} */

main();