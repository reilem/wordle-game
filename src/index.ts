import { randomInt } from 'crypto';
import fs from 'fs';
import { exit } from 'process';
import * as readline from 'readline';

interface CharacterGuessEntry {
  character: string;
  value: number;
}

const wordListFilePath = 'assets/wordlist.txt';
const wordListLength = 5757;

const maxSteps = 6;
const wordLength = 5;

let currentAnswer: string = '';
let currentSteps = 0;
let currentHistory: CharacterGuessEntry[][] = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function generateAnswer() {
  const randomIndex = randomInt(wordListLength);
  const wordListStream = fs.createReadStream(wordListFilePath);
  const wordListInterface = readline.createInterface({
    input: wordListStream,
    crlfDelay: Infinity,
  });
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
  if (guess === currentAnswer) {
    currentHistory.push(Array.from(guess).map(character => ({ character, value: 1 })));
    printHistory();
    rl.question('Congratulations, you won! Would you like to play again? (y/n) ', restartGame);
  } else {
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
    printHistory();
    askQuestion();
  }
}

function printCharGuess(row: CharacterGuessEntry[] | undefined, index: number) {
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

function printHistory() {
  console.log('---------------------');
  for (let step = 0; step < maxSteps; step++) {
    const guessHistory: CharacterGuessEntry[] | undefined = currentHistory[step];
    print('|');
    for (let i = 0; i < wordLength; i++) {
      printCharGuess(guessHistory, i);
      print('|');
    }
    print('\n---------------------\n');
  }
}

function askQuestion() {
  console.log('');
  rl.question('Enter a guess: ', wordGuess);
}

async function startGame() {
  currentSteps = 0;
  currentHistory = [];
  await generateAnswer();
  console.debug('DEBUG:', currentAnswer);
  askQuestion();
}

async function main() {
  try {
    console.log('=========================');
    console.log('|Welcome to Wordle Game |');
    console.log('=========================');
    await startGame();
  } catch (e: any) {
    console.error('Error Occurred: ', e.toString());
  }
}

main();
