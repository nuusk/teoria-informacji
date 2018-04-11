/*
Wylicz entropie znaków i słów oraz ich entropie warunkowe kolejnych rzędów dla próbki języka angielskiego (plik norm_wiki_en.txt). (2pt)
Następnie wylicz entropie znaków i słów oraz ich entropie warunkowe ko- lejnych rzędów dla próbki języka łacińskiego (plik norm_wiki_lo.txt). (2pt)
Możesz również dokonać analizy dla próbek innych języków: • esperanto (plik norm_wiki_eo.txt),
• estońskiego (plik norm_wiki_et.txt),
• somalijski (plik norm_wiki_so.txt),
• haitański (plik norm_wiki_ht.txt),
• navaho (plik norm_wiki_nv.txt),
Korzystając z zaobserwowanych wartości entropii warunkowej odpowiedź na pytanie, czy następujące pliki zawierają język naturalny: (6pt) (po (1pt) za każdy dobrze rozpoznany plik)
• sample0.txt, • sample1.txt, • sample2.txt, • sample3.txt, • sample4.txt, • sample5.txt.
*/


// aktualny rzad wyliczanej entropii
// rzad wiekszy od 0 to entropia warunkowa - czyli rozpatrujemy odpowiednia ilosc poprzednich stanow (liter badz slow)
let ORDER = 3;

const fs = require('fs');
let input = fs.readFileSync('./data/norm_wiki_en.txt', 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz1234567890 ".split("");

// dane do lancucha markova. tabelka zawierajaca odpowiednie stany i mozliwosci przejscia do kolejnego stanu
let chain = {};

let letters = input.split('');
while (ORDER <= 3) {
  for (let i=0; i<letters.length-1-ORDER; i++) {
    let currentGram = '';
    for (let j=0; j<ORDER; j++) {
      currentGram += letters[i+j];
    }
    let nextLetter = letters[i+ORDER];
    // console.log(`${currentGram} -> ${nextLetter}`);
    // jeśli taki stan jeszcze nie jest zainicjowany w strukturze to go inicjujemy
    if (!chain[currentGram]) {
      chain[currentGram] = {};
      Object.defineProperty(chain[currentGram], "!counter", {
        enumerable: false,
        writable: true
      });
      chain[currentGram][nextLetter] = 1;
      chain[currentGram]["!counter"] = 1;
    } else {
      if (!chain[currentGram][nextLetter]) {
        chain[currentGram][nextLetter] = 1;
        chain[currentGram]["!counter"]++;
      } else {
        chain[currentGram][nextLetter]++;
        chain[currentGram]["!counter"]++;
      }
    }
  };
  
  ORDER++;
}


// // ustawienie poczatkowego wyrazu
// let outputText = STARTING_TEXT;
// let currentWord;
// for (let i=1; i<=NUM_WORDS; i++) {
//   //aktualnie rozpatrywany wyraz to ostatni wyraz z aktualnie tworzonego zdania
//   currentWord = outputText.split(' ')[i-1];
//   let r = Math.floor(Math.random() * chain[currentWord]["!counter"]);  
//   let nextWord;
//   for (j in chain[currentWord]) {
//       r -= chain[currentWord][j];
//     if (r < 0) {
//       r += chain[currentWord][j];
//       nextWord = j;
//       break;
//     }
//   }
//   outputText += ' ' + nextWord;
// }

// console.log(outputText);
// // Liczenie entropii

// currentSum = 0;

// probability.forEach(letterProbability => {
//   // console.log(letterProbability);letterProbability
//   currentSum += Math.log2(letterProbability)*letterProbability;
// });

// entropy = -currentSum;

// console.log(`The entropy of this language is ${entropy}.`);