import fs from 'fs';
import * as readline from 'readline';
import { wordListFilePath } from '.';

export function getWordListReadInterface() {
  const wordListStream = fs.createReadStream(wordListFilePath);
  return readline.createInterface({
    input: wordListStream,
    crlfDelay: Infinity,
  });
}
