/*
Policz entropię występowania znaków w języku angielskim na podstawie kodu z pierwszych zajęć.
*/

const fs = require('fs');
let input = fs.readFileSync('./data/norm_wiki_en.txt', 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz1234567890 ".split("");

// indeks w tablicy counter odpowiada odpowiedniej literce/cyferce w tablicy english
let counter = [];
let probability = [];

for (let i=0; i<english.length; i++) {
  counter[i] = 0;
}
for (let i=0; i<input.length; i++) {
  // console.log(english.indexOf(input[i]));
  counter[english.indexOf(input[i])]++;
}

console.log(counter);
for (let i=0; i<counter.length; i++) {
  console.log(counter[i]);
  probability[i] = counter[i]/input.length;
}

// Liczenie entropii

currentSum = 0;

probability.forEach(letterProbability => {
  // console.log(letterProbability);letterProbability
  currentSum += Math.log2(letterProbability)*letterProbability;
});

entropy = -currentSum;

console.log(`The entropy of this language is ${entropy}.`);