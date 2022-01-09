import { exit } from 'process';
import { maxSteps, wordLength } from '..';
import { CharacterGuessEntry, CharacterValue } from '../game';
import { Color, print, printHistory } from '../util/print';
import { getReadline } from '../util/read';
import { getNextBestGuesses } from './solve';

const currentHistory: CharacterGuessEntry[][] = [];

const rl = getReadline();

function stepsPlayed() {
  return currentHistory.length;
}

function storeResult(guess: string) {
  return function (result: string) {
    if (result.length !== wordLength) {
      console.log('Incorrect length, try again!');
      askReverseQuestion();
    }
    const nextRow: CharacterGuessEntry[] = [];
    for (let i = 0; i < wordLength; i++) {
      const charResult = result[i];
      const character = guess[i];
      if (charResult === '+') {
        nextRow.push({ character, value: CharacterValue.correctPosition });
      } else if (charResult === 'o') {
        nextRow.push({ character, value: CharacterValue.inWord });
      } else {
        nextRow.push({ character, value: CharacterValue.notInWord });
      }
    }
    currentHistory.push(nextRow);
    printHistory(currentHistory);
    if (result === '+++++') {
      rl.question(`Congratulations, it looks like you won in ${stepsPlayed()} steps! Would you like to play again? (y/n) `, restartGame);
    } else if (stepsPlayed() === maxSteps) {
      rl.question(`Damn, it looks like you lost! Would you like to play again? (y/n) `, restartGame);
    } else {
      askReverseQuestion();
    }
  };
}

async function restartGame(answer: string) {
  if (answer.toLowerCase() === 'y') {
    startReverseGame();
  } else {
    rl.close();
    exit();
  }
}

function chooseGuess(guesses: string[]) {
  return function (choice: string) {
    const index = parseInt(choice);
    if (index === NaN) {
      console.log('Invalid number, try again!');
      askReverseQuestion();
    }
    const guess = guesses[index];
    console.log('');
    askResult(guess);
  };
}

function printGuesses(nextBestGuesses: string[]) {
  console.log('Next best guesses: ', nextBestGuesses.map((word, index) => `${index}: ${word}`).join(', '));
}

async function askResult(guess: string) {
  print('Your next word is: ');
  print(`${guess}\n`, undefined, Color.yellow);
  rl.question('Enter result using above format: ', storeResult(guess));
}

async function askReverseQuestion() {
  console.log('');
  const nextBestGuesses = await getNextBestGuesses(currentHistory);
  if (nextBestGuesses.length === 0) {
    console.log('No words found that match these results! Maybe you made a mistake and would like to try again? (y/n) ', restartGame);
  } else if (nextBestGuesses.length === 1) {
    const nextGuess = nextBestGuesses[0];
    askResult(nextGuess);
  } else {
    printGuesses(nextBestGuesses);
    rl.question('Choose one the above words (enter in the corresponding number): ', chooseGuess(nextBestGuesses));
  }
}

export async function startReverseGame() {
  currentHistory.splice(0, currentHistory.length);
  console.log('Starting a new reverse game! Designed to solve other wordle games.');
  console.log('At each step you must:');
  console.log('  1. Select a next best guess by entering its number.');
  console.log('  2. Enter the chosen word into your other wordle game.');
  console.log('  3. Follow the instructions and type in the result using the following format.');
  console.log('    3.1. "o" = letter in word but incorrect position.');
  console.log('    3.2. "+" = letter in correct position.');
  console.log('    3.3. "x" (or any other symbol) = wrong letter.');
  askReverseQuestion();
}
