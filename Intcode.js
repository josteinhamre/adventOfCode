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
  return Intcode(prog, input, pos + 2, intcodeOutput);
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
    return Intcode(prog, para.Read2, intcodeOutput);
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
    return [intcodeOutput, prog];
  }
  console.log('error');
  return 'error';
}

function IntcodeArgs(program, noun, verb) {
  program[1] = noun;
  program[2] = verb;
  return Intcode(program);
}

function findInputIntcode(program, desiredOutput) {
  for (let i = 50; i < 100; i += 1) {
    for (let j = 75; j < 100; j += 1) {
      const cleanProgram = Array.from(program);
      console.log('input:', i, j);
      const computedOutput = IntcodeArgs(cleanProgram, i, j);
      if (desiredOutput === computedOutput[0]) return 100 * i + j;
    }
  }
}

function generateSequencesV1() {
  let output = { lastResult: 0 };

  function loopAndExecute(
    program,
    array = [5, 6, 7, 8, 9],
    lastResult = 0,
    temp = []
  ) {
    if (!array.length && output.lastResult < lastResult) {
      output = { lastResult, temp };
    }
    for (let pos = 0; pos < array.length; pos += 1) {
      const [value] = array.splice(pos, 1);
      const result = Intcode(program, [value, lastResult]);
      loopAndExecute(program, array, result, temp.concat(value));
      array.splice(pos, 0, value);
    }
  }
  loopAndExecute(puzzles.day7code);
  return output;
}

function amplifierTest(array) {
  const result = Intcode(program, [value, lastResult]);
}

function generateSequencesV2() {
  let output = { result: 0 };

  function loopAndExecute(program, array = [5, 6, 7, 8, 9], temp = []) {
    if (!array.length) {
      result = amplifierTest(temp);
      if (result > output.result) {
        output = { result, temp };
      }
    }
    for (let pos = 0; pos < array.length; pos += 1) {
      const [value] = array.splice(pos, 1);
      loopAndExecute(program, array, temp.concat(value));
      array.splice(pos, 0, value);
    }
  }
  loopAndExecute(puzzles.day7code);
  return output;
}
// console.log(generateSequencesV2());
console.log(Intcode([puzzles.day7code], [1, 0]));
