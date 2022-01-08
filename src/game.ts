import { randomInt } from 'crypto';
import { exit } from 'process';
import * as readline from 'readline';
import { maxSteps, solveMode, wordLength, wordListLength } from '.';
import { printHistory } from './print';
import { getWordListReadInterface } from './read';

export interface CharacterGuessEntry {
  character: string;
  value: number;
}
let currentAnswer: string = '';
const currentHistory: CharacterGuessEntry[][] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function stepsPlayed() {
  return currentHistory.length;
}

async function generateAnswer() {
  const randomIndex = randomInt(wordListLength);
  const wordListInterface = getWordListReadInterface();
  let c = 0;
  for await (const line of wordListInterface) {
    if (c === randomIndex) {
      currentAnswer = line;
      break;
    }
    c++;
  }
}

async function restartGame(answer: string) {
  if (answer.toLowerCase() === 'y') {
    startGame();
  } else {
    rl.close();
    exit();
  }
}

function wordGuess(guess: string) {
  const nextRow: CharacterGuessEntry[] = [];
  for (let i = 0; i < wordLength; i++) {
    const character = guess[i];
    const answerCharacter = currentAnswer[i];
    if (character === answerCharacter) {
      nextRow.push({ character, value: 1 });
    } else if (currentAnswer.includes(character)) {
      nextRow.push({ character, value: 0 });
    } else {
      nextRow.push({ character, value: -1 });
    }
  }
  currentHistory.push(nextRow);
  printHistory(currentHistory);
  if (guess === currentAnswer) {
    rl.question(`Congratulations, you won in ${stepsPlayed()} steps! Would you like to play again? (y/n) `, restartGame);
  } else if (stepsPlayed() === maxSteps) {
    rl.question(`You lost! The answer was: ${currentAnswer}. Would you like to play again? (y/n) `, restartGame);
  } else {
    askQuestion();
  }
}

function askQuestion() {
  console.log('');
  if (solveMode) {
  }
  rl.question('Enter a guess: ', wordGuess);
}

export async function startGame() {
  currentHistory.splice(0, currentHistory.length);
  await generateAnswer();
  console.log('Starting a new game!');
  askQuestion();
}
