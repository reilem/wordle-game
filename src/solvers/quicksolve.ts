import { Color, print } from '../util/print';
import { exitGame, getWordListReadInterface } from '../util/read';
import { getWordListLength } from '../util/wordlist';

const refDate = new Date(2021, 5, 19, 0, 0, 0, 0);

function calcDateOffset(actualDate: Date) {
  var refCopy = new Date(refDate);
  var dateDiff = new Date(actualDate).setHours(0, 0, 0, 0) - refCopy.setHours(0, 0, 0, 0);
  return Math.floor(dateDiff / 86400000);
}

async function getSolution(): Promise<string> {
  const now = new Date();
  const s = calcDateOffset(now);
  const solutionIndex = s % getWordListLength();

  let c = 0;
  let solution = '';
  for await (const word of getWordListReadInterface()) {
    if (c === solutionIndex) {
      solution = word;
    }
    c++;
  }
  return solution;
}

export async function quicksolve() {
  const solution = await getSolution();
  if (solution) {
    print('Quicksolve found solution: ');
    print(`${solution}\n`, undefined, Color.green);
  } else {
    console.log('Quicksolve failed to find solution!');
  }
  exitGame();
}
