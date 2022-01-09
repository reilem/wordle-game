import { getWordListReadInterface } from './read';

let wordListLength: number = 0;

export async function initWordListLength() {
  if (wordListLength != 0) return;
  let length = 0;
  const fileReadInterface = getWordListReadInterface();
  for await (const _ of fileReadInterface) {
    length++;
  }
  wordListLength = length;
}

export function getWordListLength() {
  return wordListLength;
}
