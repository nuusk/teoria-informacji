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


// poczatkowy rzad wyliczanej entropii (bedzie sie zwiekszal az do maksymalnej wartosci)
// rzad wiekszy od 0 to entropia warunkowa - czyli rozpatrujemy odpowiednia ilosc poprzednich stanow (liter badz slow)
let ORDER = 1;
const MAX_ORDER = 5;
const LANGUAGE = 'en'; // opcje do wyboru : [en, eo, et, ht, la, nv, so]
const MARKOV_STRATEGY = 'words'
// const MARKOV_STRATEGY = 'letters'

const fs = require('fs');
let input = fs.readFileSync(`./data/norm_wiki_${LANGUAGE}.txt`, 'utf8').split('\n')[0];
let english = "abcdefghijklmnopqrstuvwxyz1234567890 ".split("");

// dane do lancucha markova. tabelka zawierajaca odpowiednie stany i mozliwosci przejscia do kolejnego stanu
let chain = {};

// zliczamy je tylko raz. tj. przy pierwszej iteracji petli (dla rzedu == ORDER.)
let alreadyCountered = false;

let grams = MARKOV_STRATEGY == 'letters'? input.split('') : input.split(' ');
while (ORDER <= MAX_ORDER) {
  // obiekt zawierajacy liczbe wystapien kazdej litery. potrzebne do wyliczenia prawdopobienstwa wystapienia liter niezaleznie od aktualnego stanu
  let counter = {};
  for (let i=0; i<grams.length-1-ORDER; i++) {
    let currentGram = '';
    for (let j=0; j<ORDER; j++) {
      if (MARKOV_STRATEGY == 'letters') {
        currentGram += grams[i+j];
      } else {
        if (j==ORDER-1) {
          currentGram += grams[i+j];
        } else {
          currentGram += grams[i+j] + ' ';
        }
      }    
    }
    let nextLetter = grams[i+ORDER];
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
    if (!chain[currentGram][nextLetter]) {
      chain[currentGram][nextLetter] = 1;
    }
    
    
    // inkrementujemy rowniez liczbe nastepnej litery. potrzebne do wyliczenia prawdopobobienstwa zadanej litery
    if (!counter[nextLetter]) {
      counter[nextLetter] = 1;
    } else {
      counter[nextLetter]++;  
    }
  };
  
  // liczenie entropii. zgodnie ze wzorem (jesli ORDER>0, to wzor na entropie warunkowa)
  let currentSum = 0

  // lacznie rozpatrujemy grams.length -1 -ORDER stanow. bedzie to przydatne do obliczenia prawdopobobienstwa zajscia zdarzenia losowego X (tj. konkretnego n-gramu)
  let numberOfGrams = grams.length - 1 - ORDER;  
  
  for (state in chain) {
    // w tym momencie rozpatrujemy tylko stany o dlugosci rownej aktualnemu ORDEROWI. poprzednie stany juz rozpatrzelismy w poprzedniej iteracji
    if (MARKOV_STRATEGY=='letters' && state.length != ORDER) continue;
    if (MARKOV_STRATEGY=='words' && state.split(' ').length != ORDER) continue;

    // prawdopobobiestwo danego stanu to iloraz tego ile razy ten stan wystapil przez liczbe wszystkich stanow
    let stateProbability = chain[state]["!counter"] / numberOfGrams;
    for (nextLetter in chain[state]) {
      // prawdopobobienstwo zajscia nastpenej litery niezaleznie od aktualnego stanu
      let nextLetterProbability = counter[nextLetter] / numberOfGrams;
      if (!nextLetterProbability) {
        console.log(`cos nie gra z ${nextLetter} w stanie ${state}`);
      }
      // console.log(`nextLetterProbability: ${nextLetterProbability}`);

      // prawdopobobienstwo laczne X i Y to iloczyn prawd. zajscia zdarzenia X i prawd. zajscia zdarzenia Y
      // let combinedProbability = stateProbability * nextLetterProbability;
      let combinedProbability = chain[state][nextLetter] / numberOfGrams;
      // console.log(`combinedProbability: ${combinedProbability}`);

      // prawdopobobienstwo warunkowe wyliczamy na podstawie wyznaczonych wczesniej w obiekcie chain wartosci
      let conditionalProbability = chain[state][nextLetter] / chain[state]["!counter"];
      // console.log(`conditionalProbability: ${conditionalProbability}`);
  
      // ze wzoru, dodajemy do naliczanej sumy iloczyn prawd.lacznego i logarytmu(2) z prawd. warunkowego
      currentSum += combinedProbability * Math.log2(conditionalProbability);
      // console.log(`currentSum: ${currentSum}`);
      
      if (conditionalProbability > 1 || combinedProbability >1 || stateProbability > 1 || nextLetterProbability > 1) {
        console.log(`prof. weglarz nie bylby z ciebie dumny. popatrz co narobiles:`);
        // console.log(`conditionalProbability: ${conditionalProbability}\n combinedProbability: ${combinedProbability}\n stateProbability: ${stateProbability}\n nextLetterProbability: ${nextLetterProbability}\n`);
        console.log(`state: ${state}`);
        console.log(`nextLetter: ${nextLetter}`);
        console.log(`chain:`);
        console.log(chain[state]);
        console.log('~~~~~~~~~~');
      }

      // if (!conditionalProbability || !combinedProbability || !stateProbability || !nextLetterProbability) {
      //   console.log(`state: ${state}`);
      //   console.log(`nextLetter: ${nextLetter}`);
      //   console.log(`chain:`);
      //   console.log(chain[state]);
      //   console.log('~~~~~~~~~~');
      // }
    }
  }

  // ostatecznie entropia to obliczona przez nas suma pomzozona razy -1
  let entropy = currentSum * (-1);

  console.log(`Entropia warunkwa strategii ${MARKOV_STRATEGY} rzedu ${ORDER} dla jezyka ${LANGUAGE} wynosi ${entropy}.`);

// probability.forEach(letterProbability => {
//   // console.log(letterProbability);letterProbability
//   currentSum += Math.log2(letterProbability)*letterProbability;
// });

// entropy = -currentSum;

// console.log(`The entropy of this language is ${entropy}.`);

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