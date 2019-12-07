const { puzzels } = require('./puzzleInputs');

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

function findCrossingPaths(a, b) {
  const coordA = generateCoordinates(a);
  const coordB = generateCoordinates(b);

  const matching = [];
  coordA.forEach(({ x: aX, y: aY, steps: aSteps }) => {
    const match = coordB.find(({ x: bX, y: bY }) => aX === bX && aY === bY);
    if (match) {
      match.aSteps = aSteps;
      matching.push(match);
    }
  });
  console.log(matching);
  return matching;
}

function findDistance(a, b) {
  const matching = findCrossingPaths(a, b);
  let distance = null;
  matching.forEach(({ x, y }) => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    if (absX + absY < distance || !distance) distance = absX + absY;
  });
  return distance;
}

function findSteps(a, b) {
  const matching = findCrossingPaths(a, b);
  let steps = null;
  matching.forEach(({ steps: bSteps, aSteps }) => {
    if (bSteps + aSteps < steps || !steps) steps = bSteps + aSteps;
  });
  return steps;
}
