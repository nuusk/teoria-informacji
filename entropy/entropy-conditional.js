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

// konfiguracja plotly
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_API_KEY);

// dane do rysowania wykresu
let dataX = [];
let dataY = [];
let data = [];

// poczatkowy rzad wyliczanej entropii (bedzie sie zwiekszal az do maksymalnej wartosci)
// rzad wiekszy od 0 to entropia warunkowa - czyli rozpatrujemy odpowiednia ilosc poprzednich stanow (liter badz slow)
let ORDER = 0;
const MAX_ORDER = 5;
const LANGUAGES = ['la', 'en', 'eo', 'et', 'ht', 'nv', 'so']; // opcje do wyboru : [en, eo, et, ht, la, nv, so]
const SAMPLES = [1, 2, 3, 4, 5, 6]; // opcje do wyboru [1,2,3,4,5, 6] (6 to jest to co bylo nazwane 0 na stronie)
// const MARKOV_STRATEGY = 'words'
const MARKOV_STRATEGY = 'letters'

const fs = require('fs');
// let input = fs.readFileSync(`./data/norm_wiki_${LANGUAGE}.txt`, 'utf8').split('\n')[0];

function calculateEntropy(markovStrategy, order, maxOrder, language=null, sample=null) {
  let textCorpus;
  if (language !== null) {
    textCorpus = fs.readFileSync(`./data/norm_wiki_${language}.txt`, 'utf-8').split('\n')[0];
  }
  else if (sample !== null) {
    console.log(sample);
    textCorpus = fs.readFileSync(`./data/sample${sample}.txt`, 'utf-8').split('\n')[0];
  }

  let grams = markovStrategy == 'letters'? textCorpus.split('') : textCorpus.split(' ');
  while (order <= maxOrder) {
    // dane do lancucha markova. tabelka zawierajaca odpowiednie stany i mozliwosci przejscia do kolejnego stanu
    let chain = {};

    // obiekt zawierajacy liczbe wystapien kazdej litery. potrzebne do wyliczenia prawdopobienstwa wystapienia liter niezaleznie od aktualnego stanu
    let counter = {};

    for (let i=0; i<grams.length-1-order; i++) {
      let currentGram = '';
      for (let j=0; j<order; j++) {
        if (markovStrategy == 'letters') {
          currentGram += grams[i+j];
        } else {
          if (j==order-1) {
            currentGram += grams[i+j];
          } else {
            currentGram += grams[i+j] + ' ';
          }
        }    
      }

      let nextGram = grams[i+order];
      // console.log(`${currentGram} -> ${nextGram}`);

      // jeśli taki stan jeszcze nie jest zainicjowany w strukturze to go inicjujemy
      if (!chain[currentGram]) {
        chain[currentGram] = {};
        Object.defineProperty(chain[currentGram], "!counter", {
          enumerable: false,
          writable: true
        });
        chain[currentGram][nextGram] = 1;
        chain[currentGram]["!counter"] = 1;
      } else {
        if (!chain[currentGram][nextGram]) {
          chain[currentGram][nextGram] = 1;
          chain[currentGram]["!counter"]++;
        } else {
          chain[currentGram][nextGram]++;
          chain[currentGram]["!counter"]++;
        }
      }
      if (!chain[currentGram][nextGram]) {
        chain[currentGram][nextGram] = 1;
      }
      
      // inkrementujemy rowniez liczbe nastepnej litery. potrzebne do wyliczenia prawdopobobienstwa zadanej litery
      if (!counter[nextGram]) {
        counter[nextGram] = 1;
      } else {
        counter[nextGram]++;  
      }
    };
    
    // liczenie entropii. zgodnie ze wzorem (jesli ORDER>0, to wzor na entropie warunkowa)
    let currentSum = 0

    // lacznie rozpatrujemy grams.length -ORDER stanow. bedzie to przydatne do obliczenia prawdopobobienstwa zajscia zdarzenia losowego X (tj. konkretnego n-gramu)
    let numberOfGrams = grams.length - order;  
    
    for (state in chain) {
      // w tym momencie rozpatrujemy tylko stany o dlugosci rownej aktualnemu ORDEROWI. poprzednie stany juz rozpatrzelismy w poprzedniej iteracji
      // if (MARKOV_STRATEGY=='letters' && state.length != ORDER) continue;
      // if (MARKOV_STRATEGY=='words' && state.split(' ').length != ORDER) continue;

      // prawdopobobiestwo danego stanu to iloraz tego ile razy ten stan wystapil przez liczbe wszystkich stanow
      let stateProbability = chain[state]["!counter"] / numberOfGrams;
      for (nextGram in chain[state]) {
        // prawdopobobienstwo zajscia nastpenej litery niezaleznie od aktualnego stanu
        let nextGramProbability = counter[nextGram] / numberOfGrams;
        if (!nextGramProbability) {
          console.log(`cos nie gra z ${nextGram} w stanie ${state}`);
        }

        // prawdopobobienstwo laczne X i Y to iloczyn prawd. zajscia zdarzenia X i prawd. zajscia zdarzenia Y
        // let combinedProbability = stateProbability * nextGramProbability;
        let combinedProbability = chain[state][nextGram] / numberOfGrams;

        // prawdopobobienstwo warunkowe wyliczamy na podstawie wyznaczonych wczesniej w obiekcie chain wartosci
        let conditionalProbability = chain[state][nextGram] / chain[state]["!counter"];
    
        // ze wzoru, dodajemy do naliczanej sumy iloczyn prawd.lacznego i logarytmu(2) z prawd. warunkowego
        currentSum += combinedProbability * Math.log2(conditionalProbability);
      }
    }

    // ostatecznie entropia to obliczona przez nas suma pomzozona razy -1
    let entropy = currentSum * (-1);

    if (language)
      console.log(`Entropia warunkwa strategii ${markovStrategy} rzedu ${order} dla jezyka ${language} wynosi ${entropy}.`);
    else if (sample)
      console.log(`Entropia warunkwa strategii ${markovStrategy} rzedu ${order} dla probki ${sample} wynosi ${entropy}.`);

    // dane do wykresu
    dataX.push(order);
    dataY.push(entropy);

    order++;
  }

  // rysowanie wykresu
  // const data = [
  //   {
  //     x: dataX,
  //     y: dataY,
  //     type: "scatter"
  //   }
  // ];
  data.push({
    x: dataX,
    y: dataY,
    type: "scatter",
    name: language? language:sample,
    mode: "lines+markers",
    marker: {
      color: `rgb(${Math.random(255)}, ${Math.random(255)}, ${Math.random(255)}`,
      size: 3,
      line: {
        color: `rgb(${Math.random(255)}, ${Math.random(255)}, ${Math.random(255)}`,
        width: 0.5
      }
    },
  });
}

// wybierz jedno z dwoch opcji (LANGUAGES / SAMPLES)

LANGUAGES.forEach(LANGUAGE => {
  calculateEntropy(MARKOV_STRATEGY, ORDER, MAX_ORDER, language=LANGUAGE);
});
// SAMPLES.forEach(SAMPLE => {
  // calculateEntropy(MARKOV_STRATEGY, ORDER, MAX_ORDER, language=null, sample=SAMPLE);  
// });

const layout = {
  title: "Entropy samples",
  xaxis: {
    title: "order",
    showgrid: true,
    zeroline: true
  },
  yaxis: {
    title: "value",
    showline: true
  }
};

const graphOptions = {layout: layout, filename: "entropy-samples", fileopt: "overwrite"};
plotly.plot(data, graphOptions,  (err, msg) => {
  console.log(`~ ~ ~ ~\n\nStworzono wykres entropii dla danego korpusu. Mozesz go przejrec pod adresem ${msg.url}\n\n~ ~ ~ ~`);
});