const { puzzles } = require('./PuzzleInputs');

function Intcode(program, input = [1], pos = 0, looping = false) {
  const prog = [...program]
  let [inst, opcode, Mode1, Mode2, Mode3, relativeBase] = [[], 0, 0, 0 ,0, 0]
  let [Read1, Read2, Write1, Write3, exitCode, intcodeOutput] = [0, 0, 0 ,0, 0, 0]

  while (exitCode !== 99) {
    inst = Array.from(String(prog[pos]), Number).reverse();
    opcode = (inst[1] || 0) * 10 + inst[0];
    Mode1 = inst[2] || 0;
    Mode2 = inst[3] || 0;
    Mode3 = inst[4] || 0;
    if (Mode1 === 0) Read1 = prog[prog[pos + 1]];
    if (Mode1 === 1) Read1 = prog[pos + 1];
    if (Mode1 === 2) Read1 = prog[relativeBase + prog[pos + 1]];
    if (Mode2 === 0) Read2 = prog[prog[pos + 2]];
    if (Mode2 === 1) Read2 = prog[pos + 2];
    if (Mode2 === 2) Read2 = prog[relativeBase + prog[pos + 2]];
    if (Read1 === undefined) Read1 = 0;
    if (Read2 === undefined) Read2 = 0;
    if (Mode1 === 0) Write1 = prog[pos + 1];
    if (Mode1 === 2) Write1 = relativeBase + prog[pos + 1];
    if (Mode3 === 0) Write3 = prog[pos + 3];
    if (Mode3 === 2) Write3 = relativeBase + prog[pos + 3];
    if (opcode === 1) {
      prog[Write3] = Read1 + Read2;
      pos += 4
    } else if (opcode === 2) {
      prog[Write3] = Read1 * Read2;
      pos += 4
    } else if (opcode === 3) {
      const currentInput = input.shift();
      prog[Write1] = currentInput;
      pos += 2
    } else if (opcode === 4) {
      intcodeOutput = Read1;
      pos += 2
      if (looping) return [exitCode, intcodeOutput, pos]
    } else if (opcode === 5) {
      if (Read1 !== 0) {
        pos = Read2
      } else {
        pos += 3
      }
    } else if (opcode === 6) {
      if (Read1 === 0) {
        pos = Read2
      } else {
        pos += 3
      }
    } else if (opcode === 7) {
      prog[Write3] = Read1 < Read2 ? 1 : 0;
      pos += 4
    } else if (opcode === 8) {
      prog[Write3] = Read1 === Read2 ? 1 : 0;
      pos += 4
    } else if (opcode === 9) {
      relativeBase += Read1
      pos += 2
    } else if (opcode === 99) {
      exitCode = 99
    } else {
      exitCode = 99
      console.log('error', opcode)
    }
  }
  return [exitCode, intcodeOutput, prog[0]];
}


function IntcodeArgs(program, noun, verb) {
  program[1] = noun;
  program[2] = verb;
  return Intcode(program);
}

function findInputIntcode(program, desiredOutput) {
  for (let i = 0; i < 100; i += 1) {
    for (let j = 0; j < 100; j += 1) {
      const cleanProgram = Array.from(program);
      const computedOutput = IntcodeArgs(cleanProgram, i, j);
      if (desiredOutput === computedOutput[2]) return 100 * i + j;
    }
  }
}

function amplifierTest(
  array = [[6, 0], [5], [7], [8], [9]],
  programs = [
    [...puzzles.day7code],
    [...puzzles.day7code],
    [...puzzles.day7code],
    [...puzzles.day7code],
    [...puzzles.day7code],
  ],
  positions = [0, 0, 0, 0, 0]
) {
  for (let i = 0; i < array.length; i += 1) {
    const amp = Intcode(programs[i], array[i], positions[i], true);
    if (amp[0] === 99) return array[i][0];
    array[(i + 1) % array.length].push(amp[1]);
    positions[i] = amp[2];
  }
  return amplifierTest(array, programs, positions);
}

function generateSequencesV2(array) {
  let output = { result: 0 };

  function loopAndExecute(array, temp = []) {
    if (!array.length) {
      const tempIn = temp.map(n => [n]);
      tempIn[0].push(0);
      const result = amplifierTest(tempIn);
      if (result > output.result) {
        output = { result, temp };
      }
    }
    for (let pos = 0; pos < array.length; pos += 1) {
      const [value] = array.splice(pos, 1);
      loopAndExecute(array, temp.concat(value));
      array.splice(pos, 0, value);
    }
  }
  loopAndExecute(array);
  return output;
}

// Test 1
console.log('Test 1')
console.log(IntcodeArgs(puzzles.day2code, 12, 2)[2]);
// Test 2
console.log('Test 2')
console.log(findInputIntcode(puzzles.day2code, 19690720));
// Test 3
console.log('Test 3')
console.log(Intcode(puzzles.day5code)[1]);
// Test 4
console.log('Test 4')
console.log(Intcode(puzzles.day5code, [5, 0])[1]);
// Test 5
console.log('Test 5')
console.log(generateSequencesV2([0, 1, 2, 3, 4]).result);
// Test 6
console.log('Test 6')
console.log(generateSequencesV2([5, 6, 7, 8, 9]).result);
// Test 7
console.log('Test 7')
console.log(Intcode(puzzles.day9code)[1]);
// Test 8
console.log('Test 8')
console.log(Intcode(puzzles.day9code, [2])[1]);