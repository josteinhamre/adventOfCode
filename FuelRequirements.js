const { puzzles } = require('./PuzzleInputs');

function calcFuel1(value) {
  const calculated = Math.floor(value / 3) - 2;
  if (calculated <= 0) return 0;
  return calculated;
}

function calcFuel2(value) {
  const calculated = Math.floor(value / 3) - 2;
  if (calculated <= 0) return 0;
  return calcFuel2(calculated) + calculated;
}

function reduceFunction(input, func) {
  const reduced2 = input.reduce(function(accumulator, currentValue) {
    return accumulator + func(currentValue);
  }, 0);
  return reduced2;
}

console.log(reduceFunction(puzzles.day1code, calcFuel1));
console.log(reduceFunction(puzzles.day1code, calcFuel2));
