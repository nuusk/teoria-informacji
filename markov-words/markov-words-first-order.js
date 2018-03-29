/*
3 Przybliżenia na podstawie źródła Markowa 10ptQ Treść
Wygeneruj przybliżenie języka angielskiego na podstawie źródła Markowa pierwszego rzędu na słowach (tzn. prawdopodobieństwo następnego słowa zależy od jednego poprzedniego słowa). (3pt)
*/

// jak wiele wyrazow chcemy w zdaniu
const NUM_WORDS = 500;

// od jakiego tekstu zaczynamy tworzyc zdanie
const STARTING_TEXT = 'probability';

const fs = require('fs');
let input = fs.readFileSync('./norm_wiki_sample.txt', 'utf8').split('\n')[0];

// dane do lancucha markova. tabelka zawierajaca odpowiednie stany i mozliwosci przejscia do kolejnego stanu
let chain = {};

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

// ustawienie poczatkowego wyrazu
let outputText = STARTING_TEXT;
let currentWord;
for (let i=1; i<=NUM_WORDS; i++) {
  //aktualnie rozpatrywany wyraz to ostatni wyraz z aktualnie tworzonego zdania
  currentWord = outputText.split(' ')[i-1];
  let r = Math.floor(Math.random() * chain[currentWord]["!counter"]);  
  let nextWord;
  for (j in chain[currentWord]) {
      r -= chain[currentWord][j];
    if (r < 0) {
      r += chain[currentWord][j];
      nextWord = j;
      break;
    }
  }
  outputText += ' ' + nextWord;
}

console.log(outputText);