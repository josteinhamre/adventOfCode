const { puzzels } = require('./puzzleInputs');

// Day 1
// Challenge 1
function fuelReduce1(base) {
  const reduced1 = base.reduce(function(accumulator, currentValue) {
    return accumulator + Math.floor(parseInt(currentValue / 3)) - 2;
  }, 0);
  return reduced1;
}

// Challange 2
function calcFuel(value) {
  const calculated = Math.floor(value / 3) - 2;
  if (calculated <= 0) return 0;
  return calcFuel(calculated) + calculated;
}

function fuelReduce2(base) {
  const reduced2 = base.reduce(function(accumulator, currentValue) {
    return accumulator + calcFuel(currentValue);
  }, 0);
  return reduced2;
}
