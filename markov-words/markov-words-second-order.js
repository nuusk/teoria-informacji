/*
3 Przybliżenia na podstawie źródła Markowa 10ptQ Treść
zrób to samo (co w first order, poprzednim zadaniu) dla źródła Markowa drugiego rzędu (tzn. praw- dopodobieństwo następnego słowa zależy od dwóch poprzednich słów). (3pt) Na koniec wygeneruj przybliżenie źródła Markowa drugiego rzędu, za-
czynając od słowa “probability”. (4pt)
*/

// jak wiele wyrazow chcemy w zdaniu
const NUM_WORDS = 500;

// od jakiego tekstu zaczynamy tworzyc zdanie
const STARTING_TEXT = 'probability';

const fs = require('fs');
let input = fs.readFileSync('./norm_wiki_sample.txt', 'utf8').split('\n')[0];

// dane do lancucha markova. tabelka zawierajaca odpowiednie stany i mozliwosci przejscia do kolejnego stanu
let chain = {};
let secondOrderChain = {};

let words = input.split(' ');
for (let i=0; i<words.length-1; i++) {
  let currentWord = words[i];
  let nextWord = words[i+1];
  // jeśli taki stan jeszcze nie jest zainicjowany w strukturze to go inicjujemy
  if (!chain[currentWord]) {
    chain[currentWord] = {};
    Object.defineProperty(chain[currentWord], "!counter", {
      enumerable: false,
      writable: true
    });
    chain[currentWord][nextWord] = 1;
    chain[currentWord]["!counter"] = 1;
  } else {
    if (!chain[currentWord][nextWord]) {
      chain[currentWord][nextWord] = 1;
      chain[currentWord]["!counter"]++;
    } else {
      chain[currentWord][nextWord]++;
      chain[currentWord]["!counter"]++;
    }
  }
};

for (let i=0; i<words.length-2; i++) {
  let currentWords = words[i] + ' ' + words[i+1];
  let nextWord = words[i+2];
  // jeśli taki stan jeszcze nie jest zainicjowany w strukturze to go inicjujemy
  if (!secondOrderChain[currentWords]) {
    secondOrderChain[currentWords] = {};
    Object.defineProperty(secondOrderChain[currentWords], "!counter", {
      enumerable: false,
      writable: true
    });
    secondOrderChain[currentWords][nextWord] = 1;
    secondOrderChain[currentWords]["!counter"] = 1;
  } else {
    if (!secondOrderChain[currentWords][nextWord]) {
      secondOrderChain[currentWords][nextWord] = 1;
      secondOrderChain[currentWords]["!counter"]++;
    } else {
      secondOrderChain[currentWords][nextWord]++;
      secondOrderChain[currentWords]["!counter"]++;
    }
  }
};

// // ustawienie poczatkowego wyrazu
let outputText = STARTING_TEXT;
let currentWord;
for (let i=1; i<=NUM_WORDS; i++) {
  // nastepny wyraz zalezy od dwoch poprzednich, chyba ze mamy aktualnie do dyspozycji tylko jeden wyraz. wtedy zalezy tylko od niego, i odwolujemy sie do zrodla markova pierwszego rzedu
  if (i==1) {
    currentState = outputText.split(' ')[i-1];
  } else {
    currentState = outputText.split(' ')[i-2] + ' ' + outputText.split(' ')[i-1];
    // console.log(currentState);
  }
  let r;
  let nextWord;
  if (i==1) {
    r = Math.floor(Math.random() * chain[currentState]["!counter"]);
    for (j in chain[currentState]) {
      r -= chain[currentState][j];
      if (r < 0) {
        r += chain[currentState][j];
        nextWord = j;
        break;
      }
    }
  } else {
    r = Math.floor(Math.random() * secondOrderChain[currentState]["!counter"]);  
    for (j in secondOrderChain[currentState]) {
      r -= secondOrderChain[currentState][j];
      if (r < 0) {
        r += secondOrderChain[currentState][j];
        nextWord = j;
        break;
      }
    }
  }

  outputText += ' ' + nextWord;
}

console.log(outputText);