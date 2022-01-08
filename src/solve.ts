import { wordLength } from '.';
import { CharacterGuessEntry, CharacterValue } from './game';
import { getWordListReadInterface } from './read';

const letterWeight: { [key: string]: number } = {
  a: 8.5,
  b: 2.1,
  c: 4.5,
  d: 3.4,
  e: 56.9,
  f: 1.8,
  g: 2.5,
  h: 3.0,
  i: 7.5,
  j: 0.2,
  k: 1.1,
  l: 5.5,
  m: 3.0,
  n: 6.7,
  o: 7.2,
  p: 3.2,
  q: 0.2,
  r: 7.6,
  s: 5.7,
  t: 7.0,
  u: 3.6,
  v: 1.0,
  w: 1.3,
  x: 0.3,
  y: 1.8,
  z: 0.2,
};

function getWordWeight(word: string) {
  let value = 0;
  const characters: string[] = [];
  for (let i = 0; i < wordLength; i++) {
    const char = word[i];
    if (characters.includes(char)) continue;
    value += letterWeight[char] || 0;
    characters.push(char);
  }
  return value;
}

function getPreviousWords(history: CharacterGuessEntry[][]) {
  const previousWords: string[] = [];
  for (const row of history) {
    let word = '';
    for (const charGuess of row) {
      word += charGuess.character;
    }
    previousWords.push(word);
  }
  return previousWords;
}

function isWordValidForRow(word: string, historyRow: CharacterGuessEntry[]) {
  for (let i = 0; i < wordLength; i++) {
    const lastCharGuess = historyRow[i];
    switch (lastCharGuess.value) {
      case CharacterValue.correctPosition:
        if (word[i] !== lastCharGuess.character) {
          return false;
        }
        break;
      case CharacterValue.inWord:
        if (!word.includes(lastCharGuess.character)) {
          return false;
        }
        break;
      case CharacterValue.notInWord:
        if (word.includes(lastCharGuess.character)) {
          return false;
        }
        break;
    }
  }
  return true;
}

function isWordValid(word: string, history: CharacterGuessEntry[][]) {
  const previousWords = getPreviousWords(history);
  if (previousWords.includes(word)) {
    return false;
  }
  for (const historyRow of history) {
    if (!isWordValidForRow(word, historyRow)) {
      return false;
    }
  }
  return true;
}

export async function printNextBestGuesses(history: CharacterGuessEntry[][]) {
  const readInterface = getWordListReadInterface();

  let currentMaxWeight = 0;
  let maxWords: string[] = [];
  for await (const word of readInterface) {
    if (!isWordValid(word, history)) {
      continue;
    }
    const wordWeight = getWordWeight(word);
    if (wordWeight > currentMaxWeight) {
      currentMaxWeight = wordWeight;
      maxWords = [word];
    } else if (wordWeight === currentMaxWeight) {
      maxWords.push(word);
    }
  }
  console.log(`Next best guesses are: ${maxWords.join(', ')}`);
}
