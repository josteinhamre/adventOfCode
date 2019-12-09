const { puzzles } = require('./PuzzleInputs');

function opcode1(prog, pos, para, input, intcodeOutput) {
  console.log('opcode 1 - Add');
  console.log('Before Write:', prog[para.Write3]);
  console.log(!para.Mode1 ? 'Remote Value 1:' : 'Local Value 1:', para.Read1);
  console.log(!para.Mode2 ? 'Remote Value 2:' : 'Local Value 2:', para.Read2);
  prog[para.Write3] = para.Read1 + para.Read2;
  console.log('After Write:', prog[para.Write3]);
  return Intcode(prog, input, pos + 4, intcodeOutput);
}
function opcode2(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 2 - Multiply');
  console.log('Before Write:', prog[para.Write3]);
  console.log(!para.Mode1 ? 'Remote Value 1:' : 'Local Value 1:', para.Read1);
  console.log(!para.Mode2 ? 'Remote Value 2:' : 'Local Value 2:', para.Read2);
  prog[para.Write3] = para.Read1 * para.Read2;
  console.log('After Write:', prog[para.Write3]);
  return Intcode(prog, input, pos + 4, intcodeOutput);
}
function opcode3(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 3 - Get input');
  console.log(input);
  const currentInput = input.shift();
  console.log('write:', para.Write1);
  console.log('Before Write:', prog[para.Write1]);
  prog[para.Write1] = currentInput;
  console.log('After Write:', prog[para.Write1]);
  return Intcode(prog, input, pos + 2, intcodeOutput);
}
function opcode4(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 4 - Give output');
  if (!para.Mode1) console.log('Remote Value 1:', para.Read1);
  console.log('Test result:', para.Read1);
  intcodeOutput = para.Read1;
  // Use for test 3
  // return Intcode(prog, input, pos + 2, intcodeOutput);
  // Use for test 4 - 6
  return [intcodeOutput, prog, pos + 2];
}
function opcode5(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 5 - Change Position if not 0');
  console.log('Perform:', para.Read1 !== 0);
  console.log('New Pos:', para.Read2);
  if (para.Read1 !== 0) {
    return Intcode(prog, input, para.Read2, intcodeOutput);
  }
  return Intcode(prog, input, pos + 3, intcodeOutput);
}
function opcode6(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 6 - Change Position if 0');
  console.log('Perform:', para.Read1 === 0);
  console.log('New Pos:', para.Read2);
  if (para.Read1 === 0) {
    return Intcode(prog, input, para.Read2, intcodeOutput);
  }
  return Intcode(prog, input, pos + 3, intcodeOutput);
}
function opcode7(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 7 - 1 smaller then 2');
  console.log('Before Write:', prog[para.Write3]);
  console.log(!para.Mode1 ? 'Remote Value 1:' : 'Local Value 1:', para.Read1);
  console.log(!para.Mode2 ? 'Remote Value 2:' : 'Local Value 2:', para.Read2);
  console.log('Value:', para.Read1 < para.Read2 ? 1 : 0);
  prog[para.Write3] = para.Read1 < para.Read2 ? 1 : 0;
  return Intcode(prog, input, pos + 4, intcodeOutput);
}
function opcode8(prog, pos, para, input, intcodeOutput) {
  console.log('Opcode: 8 - 1 equal to 2');
  console.log('Before Write:', prog[para.Write3]);
  console.log(!para.Mode1 ? 'Remote Value 1:' : 'Local Value 1:', para.Read1);
  console.log(!para.Mode2 ? 'Remote Value 2:' : 'Local Value 2:', para.Read2);
  console.log('Value:', para.Read1 === para.Read2 ? 1 : 0);
  prog[para.Write3] = para.Read1 === para.Read2 ? 1 : 0;
  return Intcode(prog, input, pos + 4, intcodeOutput);
}

function Intcode(prog, input = [1], pos = 0, intcodeOutput = 0) {
  console.log('-------------');
  const para = {};
  para.inst = Array.from(String(prog[pos]), Number).reverse();
  console.log(
    'Opcodes',
    prog[pos],
    prog[pos + 1],
    prog[pos + 2],
    prog[pos + 3]
  );
  para.opcode = (para.inst[1] || 0) * 10 + para.inst[0];
  para.Mode1 = para.inst[2] || 0;
  para.Mode2 = para.inst[3] || 0;
  para.Read1 = para.Mode1 === 1 ? prog[pos + 1] : prog[prog[pos + 1]];
  para.Read2 = para.Mode2 === 1 ? prog[pos + 2] : prog[prog[pos + 2]];
  para.Write1 = prog[pos + 1];
  para.Write3 = prog[pos + 3];
  if (para.opcode === 1) {
    return opcode1(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 2) {
    return opcode2(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 3) {
    return opcode3(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 4) {
    return opcode4(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 5) {
    return opcode5(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 6) {
    return opcode6(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 7) {
    return opcode7(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 8) {
    return opcode8(prog, pos, para, input, intcodeOutput);
  }
  if (para.opcode === 99) {
    return [99, intcodeOutput, prog, pos];
  }
  console.log('error');
  return [99, para.opcode, 'error'];
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
      console.log('-------------');
      console.log('input:', i, j);
      const computedOutput = IntcodeArgs(cleanProgram, i, j);
      if (desiredOutput === computedOutput[2][0]) return 100 * i + j;
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
    const amp = Intcode(programs[i], array[i], positions[i]);
    if (amp[0] === 99) return array[i][0];
    array[(i + 1) % array.length].push(amp[0]);
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
// console.log(IntcodeArgs(puzzles.day2code, 12, 2));
// Test 2
// console.log(findInputIntcode(puzzles.day2code, 19690720));
// Test 3
// console.log(Intcode(puzzles.day5code)[1]);
// Test 4
// console.log(Intcode(puzzles.day5code, [5, 0])[0]);
// Test 5
// console.log(generateSequencesV2([0, 1, 2, 3, 4]));
// Test 6
// console.log(generateSequencesV2([5, 6, 7, 8, 9]));
