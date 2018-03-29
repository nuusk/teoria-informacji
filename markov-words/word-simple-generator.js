/*
2 Przybliżenie pierwszego rzędu △ Treść
Używając wyliczonych prawdopodobieństw w poprzednim zadaniu,
wygeneruja ciąg słów – przybliżenie pierwszego rzędu.
*/

// KOD Z POPRZEDNIEGO ZADANIA ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
const fs = require('fs');
let input = fs.readFileSync('./norm_wiki_sample.txt', 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz ".split("");

// obiekt przechowujący licznik odpowiednich elementów. tj. ile razy to slowo wystapilo w tekscie
let dictionary = {};
// sum of all words
let numWords = 0;

let words = input.split(' ');

// slowa umieszczamy w slowniku i przypisujemy im licznik wystapien
words.forEach(word => {
  if (!dictionary[word]) dictionary[word]=0;
  dictionary[word]++;
  numWords++;
});

// tablica przechowujace te same informacje ale w bardziej przyjazny sposob
let counter = [];

// kazde slowo trafia do jednego elementu tablicy, ktory sklada sie z tego slowa oraz ile razy ono wystapilo
for (i in dictionary) {
  counter.push({
    word: i,
    count: dictionary[i],
    density: dictionary[i]/numWords
  });
}

// posortowanie calej tablicy
counter.sort((a,b)=>{
  return a.count < b.count;
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

// Generowanie slow
const NUM_WORDS = 100;

let sentence = '';

for (let i=0; i<NUM_WORDS; i++) {
  if (i!=0 && i!=NUM_WORDS-1) sentence += ' ';
  let r = Math.random();
  let chosenWordIndex = 0;
  while (r > 0) {
    r -= counter[chosenWordIndex].density;
    chosenWordIndex++;
  }
  chosenWordIndex--;
  
  sentence += counter[chosenWordIndex].word;
}

console.log(sentence);
