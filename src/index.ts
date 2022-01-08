import { startGame } from './game';
import { startReverseGame } from './reverse';

export let solveMode = false;
export let reverseMode = false;

export const wordListFilePath = 'assets/wordle-wordlist.txt';
export const wordListLength = 5757;

export const maxSteps = 6;
export const wordLength = 5;

async function main() {
  try {
    if (process.env.SOLVE) {
      solveMode = true;
      console.log('Solve Mode:', solveMode);
    }
    if (process.env.REVERSE) {
      reverseMode = true;
    }
    console.log('========================================');
    console.log('|| ~ * ~ Welcome to Wordle Game ~ * ~ ||');
    console.log('========================================');
    if (reverseMode) {
      await startReverseGame();
    } else {
      await startGame();
    }
  } catch (e: any) {
    console.error('Error Occurred: ', e.toString());
  }
}

main();
