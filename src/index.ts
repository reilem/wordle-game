import { startGame } from './game';

export let solveMode = false;

export const wordListFilePath = 'assets/wordlist.txt';
export const wordListLength = 5757;

export const maxSteps = 6;
export const wordLength = 5;

async function main() {
  try {
    if (process.env.SOLVE) {
      solveMode = true;
      console.log('Solve Mode:', solveMode);
    }
    console.log('========================================');
    console.log('|| ~ * ~ Welcome to Wordle Game ~ * ~ ||');
    console.log('========================================');
    await startGame();
  } catch (e: any) {
    console.error('Error Occurred: ', e.toString());
  }
}

main();
