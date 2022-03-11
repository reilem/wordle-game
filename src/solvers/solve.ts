import { wordLength } from '..';
import { CharacterGuessEntry, CharacterValue } from '../game';
import { getWordListReadInterface } from '../util/read';

const letterWeight: { [key: string]: number } = {
  e: 0.45615550755939527,
  a: 0.39265658747300214,
  r: 0.3615550755939525,
  o: 0.29071274298056154,
  t: 0.28812095032397406,
  l: 0.27991360691144707,
  i: 0.2794816414686825,
  s: 0.26695464362850974,
  n: 0.23758099352051837,
  u: 0.19740820734341252,
  c: 0.19352051835853132,
  y: 0.18012958963282938,
  h: 0.16371490280777537,
  d: 0.15982721382289417,
  p: 0.14946004319654427,
  g: 0.12958963282937366,
  m: 0.1287257019438445,
  b: 0.11533477321814255,
  f: 0.08941684665226782,
  k: 0.08725701943844492,
  w: 0.08380129589632829,
  v: 0.06436285097192225,
  x: 0.015982721382289417,
  z: 0.01511879049676026,
  q: 0.012526997840172787,
  j: 0.011663066954643628,
};

function getWordWeight(word: string) {
  let value = 0;
  const characters = new Set();
  for (let i = 0; i < wordLength; i++) {
    const char = word[i];
    if (characters.has(char)) continue;
    value += letterWeight[char] || 0;
    characters.add(char);
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

export async function getNextBestGuesses(history: CharacterGuessEntry[][]): Promise<string[]> {
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
  readInterface.close();
  return maxWords;
}

export async function printNextBestGuesses(history: CharacterGuessEntry[][]) {
  const maxWords = await getNextBestGuesses(history);
  console.log(`Next best guesses are: ${maxWords.join(', ')}`);
}
