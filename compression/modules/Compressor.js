const fs = require('fs');
const BitArray  = require('./BitArray');

class Compressor {
  constructor() {
    //obiekt zawierajacy kod
    this.CODE = {};
    this.BYTES = null;
  }

  // do wczytywania this.CODE
  GET_CODE(fileName) {
    const input = fs.readFileSync(fileName, 'utf8').split('\n');

    for (let line of input) {
      if (line) {
        let [key, value] = line.split(':');
        if (key === 'size') {
          this.CODE = Object.defineProperty({}, 'size', {
            value: parseInt(value),
            enumerable: false
          });
        } else {
          this.CODE[key] = new BitArray(this.CODE.size, value);
        }
      }
    }
  }

  // do wczytywania this.BYTES
  GET_BYTES(fileName) {
    // okreslamy jak duzymi chunkami bedziemy pobierac dane
    const CHUNK_SIZE = 1048576;   //1 Mb
    
    const fd = fs.openSync(fileName, 'r+');
    let bytesRead = 0;
    let currentByte = 0;
    let bytes = [];

    do {
      try {
        const buffer = new Uint8Array(CHUNK_SIZE);
        // odczytujemy synchronicznie dane z buforu 
        bytesRead = fs.readSync(fd, buffer, 0, CHUNK_SIZE);
        
        // odczytywany bajt nalezy powiekszyc o wartosc bytow ktore odczytalismy
        currentByte += bytesRead;

        // DO BAJTOW ktore byly wczesniej dorzcam to co w buforze
        bytes = [...bytes, ...buffer.slice(0, bytesRead)];
      } catch (e) {
        console.error(e);
        break;
      }
    } while (bytesRead === CHUNK_SIZE);

    this.BYTES = bytes;
  }


  SAVE(encodefileName, codeFileName) {
    this.SAVE_CODE(codeFileName);
    console.log(`Saved coded file to [${codeFileName}].`);
    this.SAVE_ENCODED(encodefileName);
    console.log(`Saved encoded file to [${encodefileName}].\n`);
  }

  LOAD(encodedFileName, codeFileName) {
    this.GET_CODE(codeFileName);
    this.GET_BYTES(encodedFileName);
  }

  SAVE_CODE(fileName) {
    let code = '';
    for (let key in this.CODE) {
      code += `${key}:${this.CODE[key].toString()}\n`;
    }
    fs.writeFileSync(fileName, code);
  }

  SAVE_DECODED(fileName, text) {
    fs.writeFileSync(fileName, text);
  }

  SAVE_ENCODED(fileName) {
    fs.writeFileSync(fileName, new Buffer(this.BYTES));
  }

  create(inputFilePath) {
    const inputText = fs.readFileSync(inputFilePath, 'utf8').split('\n')[0];
    const letters = inputText.split('');
    const density = {};

    // na poczatku tworze liste czestosci wystapien znakow
    letters.forEach(letter => {
      if (density[letter]) {
        density[letter]++;
      } else {
        density[letter]=1;
      }
    });

    // definiuje tablice zawierającą nazwy propertiesów obiektu density
    const keys = Object.keys(density);

    // wyznaczamy jaką wielkość moze osiagac kod ktory tworzymy
    this.CODE = Object.defineProperty({}, 'size', {
      value: Math.ceil(Math.log2(keys.length)),
      enumerable: false
    });

    // sortujemy w tym celu, by najczesciej uzywane znaki otrzymaly jak najmniejsza wartosc
    const sortedCounter = keys
      .map(key => ({
        char: key,
        density: density[key]
      }))
      .sort((a, b) => {
        if (a.density < b.density) return 1;
        else if (a.density === b.density) return 0;
        else return -1;
      });

    // dla kazdego klucza w kodzie tworzymy nowa wartosc (ciag 0 i 1)
    sortedCounter.forEach((element, index) => {
      this.CODE[element.char] = new BitArray(this.CODE.size, index);
      // console.log(this.CODE[element.char]);
    });
  }

  encode(filePath) {
    const inputLetters = fs.readFileSync(filePath, 'utf8').split('\n')[0].split('');
    
    const data = inputLetters
      .map(letter => this.CODE[letter].toString())
      .join('');

    console.log(`encoding data: ${data}`);

    const numBytes = Math.ceil(data.length / 8) + 1;
    this.BYTES = new Uint8Array(numBytes);
    // console.log(`this.BYTES: ${this.BYTES}`);

    const byteOffset = data.length % 8;

    this.BYTES[0] = byteOffset;

    let i = 0, j = 1;
    while(i < data.length && j < numBytes) {
      const dataChunk = data.slice(i, i + 8);
      this.BYTES[j] = new BitArray(8, dataChunk).toNumber();
      i += 8;
      j++;
    }
    console.log(`after while - this.BYTES: ${this.BYTES}`);

    // jesli cos zostalo do wpisania
    if (byteOffset) {
      const dataChunk = data.slice(i, i + byteOffset);
      // zamiast 8 bitowej tablicy robimy byteOffset
      this.BYTES[j] = new BitArray(byteOffset, dataChunk).toNumber();
      // console.log(`byteOffset - this.BYTES: ${this.BYTES}`);
    }
  }

  decode() {
    // sprawdzamy dlugosc offsetu (ogona)
    const byteOffset = this.BYTES[0];
    let data = '';
    let decoded = '';

    // jesli ogon = 0 to biore wszystkie bity, inaczej tylko do tego ostatniego
    let endPoint;
    if (byteOffset == 0) {
      endPoint = this.BYTES.length;
    } else {
      endPoint = this.BYTES.length - 1;
    }

    for (let i = 1; i < endPoint; i++) {
      // data to dlugi string 0 i 1
      data += new BitArray(8, this.BYTES[i]).toString();
    }

    if (byteOffset) {
      // jesli ogon byl niezerowy to dorzucam do niego bity o dlugosci tego lancucha
      data += new BitArray(byteOffset, this.BYTES[this.BYTES.length - 1]).toString();
    }

    // console.log(`Data while decoding: ${data}`);

    // idziemy po calym ciagu data
    // czytamy dane w zaleznosci od wartosci size, ktora zdefiniowalismy na poczatku
    for (let i = 0; i < data.length; i += this.CODE.size) {

      const dataChunk = data.slice(i, i + this.CODE.size);
      
      for (let key in this.CODE) {
        if (this.CODE.hasOwnProperty(key) && this.CODE[key].toString() === dataChunk)
          // console.log(`current ${dataChunk}->${key}`);
          decoded += key;
      }
      // console.log(decoded);
    }

    this.SAVE_DECODED('DECODED', decoded);
    console.log(`Saved decoded file to [DECODED].\n`);
  }

}

module.exports = Compressor;