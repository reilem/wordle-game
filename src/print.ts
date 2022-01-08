import { maxSteps, wordLength } from '.';
import { CharacterGuessEntry } from './game';

enum Color {
  red,
  yellow,
  green,
}

function print(str: string, color?: Color) {
  let printStr = str;
  switch (color) {
    case Color.red:
      printStr = `\x1b[30m\x1b[41m ${str} \x1b[0m`;
      break;
    case Color.green:
      printStr = `\x1b[30m\x1b[42m ${str} \x1b[0m`;
      break;
    case Color.yellow:
      printStr = `\x1b[30m\x1b[43m ${str} \x1b[0m`;
      break;
  }
  process.stdout.write(printStr);
}

export function printCharGuess(row: CharacterGuessEntry[] | undefined, index: number) {
  if (!row) {
    print('   ');
    return;
  }
  const entry = row[index];
  switch (entry.value) {
    case 1:
      print(entry.character, Color.green);
      break;
    case 0:
      print(entry.character, Color.yellow);
      break;
    default:
      print(entry.character, Color.red);
      break;
  }
}

export function printHistory(history: CharacterGuessEntry[][]) {
  console.log('---------------------');
  for (let step = 0; step < maxSteps; step++) {
    const guessHistory: CharacterGuessEntry[] | undefined = history[step];
    print('|');
    for (let i = 0; i < wordLength; i++) {
      printCharGuess(guessHistory, i);
      print('|');
    }
    print('\n---------------------\n');
  }
}