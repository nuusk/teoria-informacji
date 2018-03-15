/*
5 Przybliżenia na podstawie źródła Markova 10pt
Treść
Wygeneruj przybliżenie języka angielskiego na podstawie źródła Markova pierwszego rzędu (źródła, gdzie prawdopodobieństwo następnego symbolu zależy od 1. poprzedniego).
Następnie zrób to samo dla źródła Markova trzeciego rzędu (źródła, gdzie prawdopodobieństwo następnego symbolu zależy od 3. poprzednich).
Na koniec wygeneruj przybliżenie źródła Markova piątego rzedu. Zaczynij od ciągu znaków zawierającego już słowo ’probability’.
Jaka jest średnia długość wyrazu w tych przybliżeniach?
*/

// ilu literowe n-gramy
const ORDER = 5;

// jak dlugie zdanie chcemy ulozyc
const SENTENCE_LENGTH = 200;

// od jakiego tekstu zaczynamy tworzyc zdanie
const STARTING_TEXT = 'there'

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
  // console.log(`~~~~ ${gram} ~~~~`);
  for (nextLetter in ngrams[gram]) {
    // if (nextLetter != 'counter')
      // console.log(`Prawdopobobieństwo wystąpienia ${nextLetter} po ciągu znaków ${gram} wynosi ${ngrams[gram][nextLetter]/ngrams[gram].counter}`);
  }
}
// console.log(ngrams);

let outputText = STARTING_TEXT;

for (let i=0; i<SENTENCE_LENGTH; i++) {

  // Wylosuj nastepna litere
  let currentGram = outputText.substr(i, ORDER);
  // console.log(ngrams[currentGram].counter);
  let r = Math.floor(Math.random() * ngrams[currentGram].counter);  
  // console.log('starting r ' + r);
  let nextLetter;
  for (j in ngrams[currentGram]) {
    if (j != 'counter') {
      // console.log(r);
      r -= ngrams[currentGram][j];
      // console.log(ngrams[currentGram][j]);
    }
    if (r < 0) {
      r += ngrams[currentGram][j];
      nextLetter = j;
      break;
    }
    // console.log(j);
  }
  // console.log(nextLetter);
  outputText += nextLetter;

}

console.log(outputText);