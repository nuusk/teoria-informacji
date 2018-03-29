// konfiguracja plotly
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_API_KEY);

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
const SENTENCE_LENGTH = 500;

// od jakiego tekstu zaczynamy tworzyc zdanie
const STARTING_TEXT = 'romeo';

// dane do generowania histogramu
let plotX = [];

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

let outputText = STARTING_TEXT;

for (let i=STARTING_TEXT.length-ORDER; i<SENTENCE_LENGTH; i++) {
  //aktualnie rozpatrywany gram (ciag literek o dlugosci ORDER)
  let currentGram;
  let currentOrder = ORDER;
  // Jesli takiego gramu nie mamy w naszej bazie, zmniejszamy ngram. (czyli jesli nie bylo danego slowa, patrzymy na mniej poprzednich literek)
  do {
    currentGram = outputText.substr(i+ORDER-currentOrder, currentOrder);
    currentOrder--;
    if (currentOrder == 0) {
      // console.log('asd');
      process.exit();
    }
    // console.log(currentGram);
  } while (!ngrams[currentGram]);
  let r = Math.floor(Math.random() * ngrams[currentGram].counter);  
  let nextLetter;
  for (j in ngrams[currentGram]) {
    // pomijamy counter, bo to nie jest literka
    if (j != 'counter') {
      r -= ngrams[currentGram][j];
    }
    if (r < 0) {
      r += ngrams[currentGram][j];
      nextLetter = j;
      break;
    }
  }
  outputText += nextLetter;
}

// console.log(ngrams);
console.log(outputText);

//!!!! SPRAWDZANIE DLUGOSCI WYRAZOW
// to dla naszego wygenerowanego tekstu
let words = outputText.split(" ");

//to dla domyslnie wprowadzonego tekstu (tego ktory tworzyl korpus)
let words2 = input.split(" ");

let length = words.length;
let length2 = words2.length;
let sum = 0;
let sum2 = 0;

// dla wyjsciowego tekstu
for (let i=0; i<words.length; i++) {
  if (words[i].length == 0) {
    length--;
  } else {
    plotX.push(words[i].length);
    sum += words[i].length;
  }        
}

// dla korpusu
for (let i=0; i<words2.length; i++) {
  if (words2[i].length == 0) {
    length2--;
  } else {
    sum2 += words2[i].length;
  }        
}

console.log(`\n<><><><><><>\nŚrednia długość słów wygenerowanego tekstu to: ${sum/length}.`);
console.log(`W korpusie ta wartosc byla rowna: ${sum2 /= length2}.\n<><><><><>\n`);

// RYSOWANIE HISTOGRAMU
const data = [
  {
    x: plotX,
    type: "histogram"
  }
];

const graphOptions = {filename: "basic-histogram", fileopt: "overwrite"};
plotly.plot(data, graphOptions,  (err, msg) => {
  console.log(`~ ~ ~ ~\n\nStworzono histogram dlugosci slow. Mozesz go przejrec pod adresem ${msg.url}\n\n~ ~ ~ ~`);
});
