/*
Jaka będzie entropia przybliżenia zerowego rzędu dla przybliżenia języka
angielskiego generowanego na poziomie znaków? Przypomnienie: 26 liter + cyfry + spacja, mające jednakowe prawdopodobieństwo wystąpienia.
*/

let english = "abcdefghijklmnopqrstuvwxyz1234567890 ".split("");

currentSum = 0;

english.forEach(letter => {
  currentSum += Math.log2(1/english.length)*(1/english.length);
});

console.log(`The entropy of alphabet (zero order) is ${-currentSum}.`);