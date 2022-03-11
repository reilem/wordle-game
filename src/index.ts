import { startGame } from './game';
import { quicksolve } from './solvers/quicksolve';
import { startReverseGame } from './solvers/reverse';
import { stats } from './util/stats';
import { initWordListLength } from './util/wordlist';

export let solveMode = false;
export let reverseMode = false;
export let quicksolveLiveMode = false;
export let statsMode = false;

export const wordListFilePath = 'assets/wordle-wordlist.txt';

export const maxSteps = 6;
export const wordLength = 5;

function initParameters() {
  solveMode = !!process.env.SOLVE;
  if (solveMode) {
    console.log('Solve Mode:', solveMode);
  }
  statsMode = !!process.env.STATS_MODE;
  reverseMode = !!process.env.REVERSE;
  quicksolveLiveMode = !!process.env.QUICKSOLVE;
}

async function main() {
  try {
    await initWordListLength();
    initParameters();

    console.log('========================================');
    console.log('|| ~ * ~ Welcome to Wordle Game ~ * ~ ||');
    console.log('========================================');

    if (quicksolveLiveMode) {
      await quicksolve();
    } else if (reverseMode) {
      await startReverseGame();
    } else if (statsMode) {
      await stats();
    } else {
      await startGame();
    }
  } catch (e: any) {
    console.error('Error Occurred: ', e.toString());
  }
}

main();
