const fs = require('fs');
let input = fs.readFileSync('./romeo.txt', 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz ".split("");
let counter = [];
for (let i=0; i<english.length; i++) {
    counter[i]=0;
}
// console.log(input);

for (let i=0; i<input.length; i++) {
    counter[english.indexOf(input[i])]++;
    // console.log(english.indexOf(input[i]));
}

for (let i=0; i<english.length; i++) {
    console.log(`${english[i]}: ${counter[i]/input.length*100}`);
}
