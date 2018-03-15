/*
4 Prawdopodobieństwo warunkowe liter △ Treść
Czy różne znaki występują jednakowo często po sobie? Oblicz prawdopo- dobieństwo wystąpienia poszczególnych znaków po każdym z 2. najczęściej występujących znaków w korpusie.
*/

// ilu literowe n-gramy
const ORDER = 2;

const fs = require('fs');
let input = fs.readFileSync('./romeo.txt', 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz ".split("");

// Generacja bigramów. Tworzymy wszystkie mozliwye pary liter
// dla kazdej z tych par policzymy prawdopodobieństwo wystąpienia kolejnej litery po tej parze
let englishBigrams = {};
for (let i=0; i<english.length; i++) {
  for (let j=0; j<english.length; j++) {
    if (i !== j) {
      englishBigrams[english[i]+english[j]] = {};
    }
  }
}

let ngrams = {};

// Oblicz liczbe wystapien litery po kazdej parze liter
for (let i=0; i<input.length-ORDER; i++) {
  let gram = input.substr(i, ORDER);
  if (!ngrams[gram]) {
    ngrams[gram] = {};
    ngrams[gram][input.charAt(i+ORDER)] = 1;
    ngrams[gram].counter = 1;
  } else {
    if (!ngrams[gram][input.charAt(i+ORDER)]) {
      ngrams[gram][input.charAt(i+ORDER)] = 1;
      ngrams[gram].counter++;
    } else {
      ngrams[gram][input.charAt(i+ORDER)]++;
      ngrams[gram].counter++;
    }
  }
}

// Wypisz (jesli niezerowe) prawdopodobienstwa wystapienia kolejnej litery po zadanym ciagu znakow
for (gram in ngrams) {
  console.log(`~~~~ ${gram} ~~~~`);
  for (nextLetter in ngrams[gram]) {
    if (nextLetter != 'counter')
      console.log(`Prawdopobobieństwo wystąpienia ${nextLetter} po ciągu znaków ${gram} wynosi ${ngrams[gram][nextLetter]/ngrams[gram].counter}`);
  }
}
// console.log(ngrams);