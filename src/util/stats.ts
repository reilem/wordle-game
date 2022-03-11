import { getWordListReadInterface } from './read';

export async function stats() {
  await calculateMostCommonLetters();
}

export async function calculateMostCommonLetters() {
  const wordlistInterface = getWordListReadInterface();
  let totalWords = 0;
  const words = [];
  const letterOccurrences = new Map<string, number>();
  for await (const word of wordlistInterface) {
    const duplicates = new Set();
    for (const c of word) {
      if (!duplicates.has(c)) {
        const ocurrence = letterOccurrences.get(c) || 0;
        letterOccurrences.set(c, ocurrence + 1);
        duplicates.add(c);
      }
    }
    words.push(word);
    totalWords++;
  }
  const weightedCharacters = calculateWeightedCharacters(letterOccurrences, totalWords);
  const weightedWords = calculateWeightedWords(words, weightedCharacters);
  console.log('Highest scoring words with this word list:');
  console.log(weightedWords);
}

function calculateWeightedCharacters(letterOccurrences: Map<string, number>, totalWords: number): Map<string, number> {
  const occurences = Array.from(letterOccurrences.entries());
  occurences.sort((a, b) => b[1] - a[1]);
  const weightedCharacters = occurences.reduce<Map<string, number>>((acc, [char, value]) => {
    acc.set(char, value / totalWords);
    return acc;
  }, new Map());
  console.log(weightedCharacters);
  return weightedCharacters;
}

function calculateWeightedWords(words: string[], weightedCharacters: Map<string, number>) {
  const weightedWords = words.reduce<[string, number][]>((acc, word) => {
    acc.push([word, wordWeight(word, weightedCharacters)]);
    return acc;
  }, []);
  weightedWords.sort((a, b) => b[1] - a[1]);
  return weightedWords;
}

function wordWeight(word: string, weightedCharacters: Map<string, number>): number {
  const chars = new Set();
  let score = 0;
  for (const c of word) {
    if (!chars.has(c)) {
      score += weightedCharacters.get(c) || 0;
      chars.add(c);
    }
  }
  return score;
}
