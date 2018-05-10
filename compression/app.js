const Compressor = require('./modules/Compressor');
const compressor = new Compressor();

const testFile = 'data/test.txt';
// const wikiFile = 'data/norm_wiki_sample.txt';

const ENCODE_NAME = 'ENCODED';
const CODE_NAME = 'CODE';
const DECODED_NAME = 'DECODED';

compressor.create(testFile);
// console.log(compressor._code);
compressor.encode(testFile);
compressor.save(ENCODE_NAME, CODE_NAME);

compressor.load(ENCODE_NAME, CODE_NAME);
compressor.decode();