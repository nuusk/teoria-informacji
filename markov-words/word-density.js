/*
1 Częstość słów △ Treść
Zadanie polega na policzeniu częstości występowania słów w angielskim tek- ście. Jakie słowa występują najczęściej i jaki procent wszystkich słów stano- wią?
Podobno przeciętny Polak zna 30 tys. słów, a posługuje się tylko 20% z tego zbioru, co daje tylko 6 tys. słów. Czy w Polsce panuje ubóstwo językowe? Sprawdź jaki procent “wiedzy” z Wikipedii umiałby przekazać przeciętny Polak, gdyby jego elokwencje przełożyć na grunt języka angielskiego.
Policz jaki procent wszystkich słów stanowi zbiór 30 tys. najpopularniej- szych słów, a jaki procent stanowi zbiór 6 tys..
*/

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

// counter.forEach(word => {
//   console.log(word);
// });

// JAKI PROCENT WSZYSTKICH SLOW STANOWI ZBIOR 30 TYS NAJPOPULARNIEJSZYCH SLOW
function getPercentageOf(numOfPopularWords) {
  let percentage = 0;
  for (let i=0; i<numOfPopularWords; i++) {
    percentage += counter[i].density;
  }
  percentage=percentage.toFixed(4);
  console.log(`The set of ${numOfPopularWords} most popular words accounts for ${percentage}% of all words used.`);
}

getPercentageOf(30000);
getPercentageOf(6000);
getPercentageOf(1000);
getPercentageOf(500);
getPercentageOf(250);
getPercentageOf(100);
getPercentageOf(50);
getPercentageOf(25);
getPercentageOf(5);
