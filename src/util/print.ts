import { maxSteps, wordLength } from '..';
import { CharacterGuessEntry, CharacterValue } from '../game';

export enum Color {
  red,
  yellow,
  green,
}

export function print(str: string, backgroundColor?: Color, foregroundColor?: Color) {
  let printStr = str;
  if (backgroundColor != null && foregroundColor == null) {
    switch (backgroundColor) {
      case Color.red:
        printStr = `\x1b[30m\x1b[41m${str}\x1b[0m`;
        break;
      case Color.green:
        printStr = `\x1b[30m\x1b[42m${str}\x1b[0m`;
        break;
      case Color.yellow:
        printStr = `\x1b[30m\x1b[43m${str}\x1b[0m`;
        break;
    }
  }
  if (backgroundColor == null && foregroundColor != null) {
    switch (foregroundColor) {
      case Color.red:
        printStr = `\x1b[31m\x1b[40m${str}\x1b[0m`;
        break;
      case Color.green:
        printStr = `\x1b[32m\x1b[40m${str}\x1b[0m`;
        break;
      case Color.yellow:
        printStr = `\x1b[33m\x1b[40m${str}\x1b[0m`;
        break;
    }
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
    case CharacterValue.correctPosition:
      print(` ${entry.character} `, Color.green);
      break;
    case CharacterValue.inWord:
      print(` ${entry.character} `, Color.yellow);
      break;
    case CharacterValue.notInWord:
      print(` ${entry.character} `, Color.red);
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
