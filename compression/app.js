const Compressor = require('./modules/Compressor');
const compressor = new Compressor();

// const testFile = 'data/test.txt';
const wikiFile = 'data/norm_wiki_sample.txt';

const ENCODE_NAME = 'ENCODED';
const CODE_NAME = 'CODE';
const DECODED_NAME = 'DECODED';

compressor.create(wikiFile);
// console.log(compressor._code);
compressor.encode(wikiFile);
compressor.SAVE(ENCODE_NAME, CODE_NAME);

compressor.LOAD(ENCODE_NAME, CODE_NAME);
compressor.decode();