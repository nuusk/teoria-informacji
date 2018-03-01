const LIMIT = 30000;
const fs = require('fs');
let input = fs.readFileSync('./romeo.txt', 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz ".split("");
let counter = [];
let probability = [];
for (let i=0; i<english.length; i++) {
    counter[i]=0;
}
// console.log(input);

for (let i=0; i<input.length; i++) {
    counter[english.indexOf(input[i])]++;
    // console.log(english.indexOf(input[i]));
}

for (let i=0; i<english.length; i++) {
    probability[i] = counter[i]/input.length;
    // console.log(probability[i]);
    // console.log(`${english[i]}: ${probability[i]*100}`);
}



let s250 = 0;
let s255 = 0;
let s260 = 0;
let s265 = 0;
let s270 = 0;

for (let j=0; j<200; j++) {
    let sentence = '';
    
    for (let i=0; i<LIMIT; i++) {
        let r = Math.random(1);
        let j=0;
        while (r > 0) {
            r = r - probability[j];
            // console.log(probability[j]);
            j++
        }
        j--;
        sentence += english[j];
    }
    
    let words = sentence.split(" ");
    let words2 = input.split(" ");

    let length = words.length;
    let length2 = words2.length;
    let sum = 0;
    let sum2 = 0;
    for (let i=0; i<words.length; i++) {
        if (words[i].length == 0) {
            length--;
        } else {
            sum += words[i].length;
        }        
    }
    
    for (let i=0; i<words2.length; i++) {
        if (words2[i].length == 0) {
            length2--;
        } else {
            sum2 += words2[i].length;
        }        
    }

    sum /= length;
    sum2 /= length2;
    // console.log(sum);

    // if (sum < 25.5) s250++;
    // else if (sum < 26) s255++;
    // else if (sum < 26.5) s260++;
    // else if (sum < 27) s265++;
    // else if (sum < 27.5) s270++;
    console.log(`Średnia długość słów to: ${sum}.`);
    console.log(`org: ${sum2}.`);
}



// console.log(`Średnia długość słów to: ${sum}.`);

// console.log(`25-25.5: ${s250}`);
// console.log(`25.5-26: ${s255}`);
// console.log(`26-26.5: ${s260}`);
// console.log(`26.5-27: ${s265}`);
// console.log(`27-27.5: ${s270}`);

// console.log(`53-53.5: ${s530}`);
// console.log(`53.5-54: ${s535}`);
// console.log(`54-54.5: ${s540}`);
// console.log(`54.5-55: ${s545}`);
// console.log(`55-55.5: ${s550}`);
