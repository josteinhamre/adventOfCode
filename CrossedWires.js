const { puzzles } = require('./PuzzleInputs');

function generateCoordinates(instructions) {
  let [x, y] = [0, 0];
  const coordinates = [];
  let steps = 0;
  instructions.map(instruction => {
    const count = parseInt(instruction.slice(1));
    for (let i = 0; i < count; i += 1) {
      switch (instruction[0]) {
        case 'U':
          y += 1;
          break;
        case 'D':
          y -= 1;
          break;
        case 'R':
          x += 1;
          break;
        case 'L':
          x -= 1;
          break;
        default:
          return 'error';
      }
      steps += 1;
      coordinates.push({ x, y, steps });
    }
    return null;
  });
  return coordinates;
}

function findLowestProperty(matching, key) {
  let bestMatch = matching[0];
  matching.forEach(match => {
    if (match[key] < bestMatch[key]) bestMatch = match;
  });
  return bestMatch;
}

function findCrossingPaths(a, b) {
  console.log('Generating a...');
  const coordA = generateCoordinates(a);
  console.log('Generating b...');
  const coordB = generateCoordinates(b);
  console.log('Starting Matching...');
  const matching = [];
  coordA.forEach(({ x: aX, y: aY, steps: aSteps }) => {
    const match = coordB.find(({ x: bX, y: bY }) => aX === bX && aY === bY);
    if (match) {
      match.distance = Math.abs(match.x) + Math.abs(match.y);
      match.aSteps = aSteps;
      match.bSteps = match.steps;
      match.steps += aSteps;
      matching.push(match);
      console.log(match);
    }
  });
  console.log('Identifying shortest distance...');
  console.log('Shortest distance', findLowestProperty(matching, 'distance'));
  console.log('Identifying fewest steps');
  console.log('Fewest steps', findLowestProperty(matching, 'steps'));
  return matching;
}

findCrossingPaths(puzzles.day3codeA, puzzles.day3codeB);
