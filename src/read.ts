import fs from 'fs';
import * as readline from 'readline';
import { wordListFilePath } from '.';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function getWordListReadInterface() {
  const wordListStream = fs.createReadStream(wordListFilePath);
  return readline.createInterface({
    input: wordListStream,
    crlfDelay: Infinity,
  });
}

export function getReadline() {
  return rl;
}
