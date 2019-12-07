const { puzzles } = require('./PuzzleInputs');

function oneDouble(string) {
  for (let i = 0; i < string.length - 1; i += 1) {
    const current = string[i];
    const next = string[i + 1];
    const previous = string[i - 1] || 'x';
    const secondNext = string[i + 2] || 'x';
    if (current === next && current !== previous && current !== secondNext) {
      // console.log(i, '-', previous, current, next, secondNext, ' - true');
      return true;
    }
  }
  return false;
}

function noDecrease(string) {
  for (let i = 0; i < string.length - 1; i += 1) {
    if (string[i] > string[i + 1]) return false;
  }
  return true;
}

function validKey(number) {
  const string = number.toString();
  return string.length === 6 && noDecrease(string) && oneDouble(string);
}

function testSequence(start, end) {
  let validKeys = 0;
  for (let i = start; i <= end; i += 1) {
    if (validKey(i)) validKeys += 1;
  }
  return validKeys;
}

console.log(testSequence(puzzles.day4code[0], puzzles.day4code[1]));
