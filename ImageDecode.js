const { puzzles } = require('./PuzzleInputs');

function imageDecode(array) {
  // Splits code in to layers.
  let temp = [...array];
  const layers = [];
  let layer = [];
  while (temp[0] !== undefined) {
    layer = temp.slice(0, 150);
    temp = temp.slice(150);
    layers.push(layer);
  }

  // Finds the layer with the fewest 0's,
  // and returnes the multiplied value of the number of 1's and 2's
  let part1 = { 0: 150 };
  let count = { 0: 0, 1: 0, 2: 0, multi: 0 };
  layers.forEach(lay => {
    lay.forEach(n => (count[n] += 1));
    count.multi = count[1] * count[2];
    if (count[0] < part1[0]) {
      part1 = count;
    }
    count = { 0: 0, 1: 0, 2: 0, multi: 0 };
  });

  // Merges all layers into 1 layer
  const output = layers.reduce((sum, layer) =>
    sum.map((n, i) => (n == 2 ? layer[i] : n))
  );
  // Removes 0's in the layer, and returns it in a readable array of lines
  const part2 = [];
  for (let i = 0; i < 6; i += 1) {
    const line = output
      .slice(i * 25, (i + 1) * 25)
      .join('')
      .replace(/0/g, ' ');
    part2.push(line);
  }

  return [part1, part2];
}
console.log(imageDecode(puzzles.day8code));
