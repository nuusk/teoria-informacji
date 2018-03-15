const LIMIT = 300000;
let s250 = 0;
let s255 = 0;
let s260 = 0;
let s265 = 0;
let s270 = 0;

// let s530 = 0;
// let s535 = 0;
// let s540 = 0;
// let s545 = 0;
// let s550 = 0;

for (let j=0; j<20; j++) {
    let english = "abcdefghijklmnopqrstuvwxyz ".split("");
    let sentence = '';
    for (let i=0; i<LIMIT; i++) {
        let tmp = Math.floor(Math.random() * (english.length));
        sentence += english[tmp];
    }
    
    let words = sentence.split(" ");
    let length = words.length;
    let sum = 0;
    for (let i=0; i<words.length; i++) {
        if (words[i].length == 0) {
            length--;
        } else {
            sum += words[i].length;
        }        
    }
    
    sum /= length;
    // console.log(sum);

    if (sum < 25.5) s250++;
    else if (sum < 26) s255++;
    else if (sum < 26.5) s260++;
    else if (sum < 27) s265++;
    else if (sum < 27.5) s270++;

}



// console.log(`Średnia długość słów to: ${sum}.`);

console.log(`25-25.5: ${s250}`);
console.log(`25.5-26: ${s255}`);
console.log(`26-26.5: ${s260}`);
console.log(`26.5-27: ${s265}`);
console.log(`27-27.5: ${s270}`);

// console.log(`53-53.5: ${s530}`);
// console.log(`53.5-54: ${s535}`);
// console.log(`54-54.5: ${s540}`);
// console.log(`54.5-55: ${s545}`);
// console.log(`55-55.5: ${s550}`);