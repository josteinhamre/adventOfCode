const { puzzles } = require('./PuzzleInputs');

// Convert all # to coordinates for the #
function generateCoordinates(input) {
  return input
    .map((row, i) => {
      const coordRow = [];
      for (let j = 0; j < row.length; j += 1) {
        if (row[j] === '#') {
          coordRow.push({ x: j, y: i });
        }
      }
      return coordRow;
    })
    .flat();
}

// Find all visible Astroids from the given Astroid
function findVisible(coords, JSONcoords, x, y) {
  const mCoord = { x, y };
  return coords.filter(fCoord => {
    // Filters out self
    if (JSON.stringify(mCoord) === JSON.stringify(fCoord)) return false;
    // Generates all coordinates for the Path from the given Astroid, to the current Astroid
    const pathCoords = [];
    const xDist = fCoord.x - mCoord.x;
    const yDist = fCoord.y - mCoord.y;
    for (let i = Math.sign(xDist); i !== xDist; i += Math.sign(xDist)) {
      const pathCoord = { x: mCoord.x + i, y: mCoord.y + (yDist / xDist) * i };
      pathCoords.push(pathCoord);
    }
    // Special case for elements on the same x/y axis as the object
    if (xDist === 0) {
      for (let j = Math.sign(yDist); j !== yDist; j += Math.sign(yDist)) {
        pathCoords.push({
          x: mCoord.x,
          y: mCoord.y + j,
        });
      }
    }
    // Filter out any path coordinates that crashes with an astroid.
    const pathCoordsFiltered = pathCoords.filter(
      pCoord => !JSONcoords.includes(JSON.stringify(pCoord))
    );
    // Check wether a path has crashed or not, and return True/False
    // in order to filter out the ones that are not visible.
    return pathCoords.length === pathCoordsFiltered.length;
  });
}

// Test all astroids, to see wich ones has the best visibility.
function findBestVisibility(coords) {
  // Stringify the object array, in order to easier do matching.
  const JSONcoords = JSON.stringify(coords);
  const visibility = coords.map(mCoord => {
    mCoord.count = findVisible(coords, JSONcoords, mCoord.x, mCoord.y).length;
    return mCoord;
  });
  let best = visibility[0];
  // Locate the coordinates with the highest count of visible Astroids
  visibility.forEach(coord => {
    if (best.count < coord.count) {
      best = coord;
    }
  });
  return [best, visibility];
}

// Calculate a rotational position, add it to the object and sort the array based on that position.
function visibleWith(coords, x, y) {
  const visible = findVisible(coords, JSON.stringify(coords), x, y);
  const visibleWithPos = visible.map(coord => {
    const xDist = Math.abs(x - coord.x);
    const yDist = Math.abs(y - coord.y);
    if (coord.x > x && coord.y < y) {
      coord.pos = (xDist / yDist) * 1;
    } else if (coord.x > x && coord.y > y) {
      coord.pos = (yDist / xDist) * 100;
    } else if (coord.x < x && coord.y > y) {
      coord.pos = (xDist / yDist) * 10000;
    } else if (coord.x < x && coord.y < y) {
      coord.pos = (yDist / xDist) * 1000000;
    } else {
      coord.pos = xDist === 0 ? Math.sign(coord.y) : Math.sign(coord.x);
    }
    return coord;
  });
  return visibleWithPos.sort((a, b) => {
    if (a.pos > b.pos) {
      return -1;
    }
    x;
    return +1;
  });
}

const input = generateCoordinates(puzzles.day10code);
console.log(findBestVisibility(input)[0]);
console.log(visibleWith(input, 11, 13)[27]);
