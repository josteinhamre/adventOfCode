const { puzzles } = require('./PuzzleInputs');

function createMap(input, object = {}) {
  const new_input = [];
  object.COM = { children: [], parents: [] };
  object.COM.count = 0;
  for (let i = 0; i < input.length; i += 2) {
    if (object[input[i]] === undefined) {
      new_input.push(input[i], input[i + 1]);
    } else {
      object[input[i + 1]] = { children: [], parents: [] };
      object[input[i + 1]].count = object[input[i]].count + 1;
      object[input[i + 1]].parents = object[input[i]].parents.slice();
      object[input[i + 1]].parents.push(input[i]);
      object[input[i]].children.push(input[i + 1]);
    }
  }
  if (new_input.length) {
    return createMap(new_input, object);
  }
  return object;
}

function findCount(object) {
  keys = Object.keys(object);
  return keys.reduce((sum, key) => sum + object[key].count, 0);
}

function filterOutMatching(a, b) {
  return a.filter(el => !b.includes(el));
}

function findPath(object) {
  const YOUarray = object.YOU.parents;
  const SANarray = object.SAN.parents;
  const YOUfiltered = filterOutMatching(YOUarray, SANarray);
  const SANfiltered = filterOutMatching(SANarray, YOUarray);
  return YOUfiltered.length + SANfiltered.length;
}

function getSolutions(input) {
  object = createMap(input);
  console.log('Direct and indirect orbits:', findCount(object));
  console.log('Transfers required to santa:', findPath(object));
}

getSolutions(puzzles.day6code);
