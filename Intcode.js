const { puzzels } = require('./puzzleInputs');

function Intcode(prog, input = 1, pos = 0) {
  console.log('-------------');
  const inst = Array.from(String(prog[pos]), Number).reverse();
  const opcode = (inst[1] || 0) * 10 + inst[0];
  const pMode1 = inst[2] || 0;
  const pMode2 = inst[3] || 0;
  const paramRead1 = pMode1 === 1 ? prog[pos + 1] : prog[prog[pos + 1]];
  const paramRead2 = pMode2 === 1 ? prog[pos + 2] : prog[prog[pos + 2]];
  const paramWrite1 = prog[pos + 1];
  const paramWrite3 = prog[pos + 3];
  if (opcode === 1) {
    console.log(
      'Current IntCode:',
      prog[pos],
      prog[pos + 1],
      prog[pos + 2],
      prog[pos + 3]
    );
    console.log('opcode:', opcode, 'Add');
    console.log('Before Write:', prog[paramWrite3]);
    if (!pMode1) console.log('Remote Value 1:', paramRead1);
    if (!pMode2) console.log('Remote Value 2:', paramRead2);
    console.log('Value:', paramRead1 + paramRead2);
    prog[paramWrite3] = paramRead1 + paramRead2;
    console.log('After Write:', prog[paramWrite3]);
    return Intcode(prog, input, pos + 4);
  }
  if (opcode === 2) {
    console.log(
      'Current IntCode:',
      prog[pos],
      prog[pos + 1],
      prog[pos + 2],
      prog[pos + 3]
    );
    console.log('opcode:', opcode, 'Multiply');
    console.log('Before Write:', prog[paramWrite3]);
    if (!pMode1) console.log('Remote Value 1:', paramRead1);
    if (!pMode2) console.log('Remote Value 2:', paramRead2);
    console.log('Value:', paramRead1 * paramRead2);
    prog[paramWrite3] = paramRead1 * paramRead2;
    console.log('After Write:', prog[paramWrite3]);
    return Intcode(prog, input, pos + 4);
  }
  if (opcode === 3) {
    console.log('Current IntCode:', prog[pos], prog[pos + 1]);
    console.log('opcode:', opcode, 'Get input');
    console.log('Before Write:', prog[paramWrite1]);
    console.log('User Input:', input);
    prog[paramWrite1] = input;
    console.log('After Write:', prog[paramWrite1]);
    return Intcode(prog, input, pos + 2);
  }
  if (opcode === 4) {
    console.log('Current IntCode:', prog[pos], prog[pos + 1]);
    console.log('opcode:', opcode, 'Give output');
    if (!pMode1) console.log('Remote Value 1:', paramRead1);
    console.log('Test result:', paramRead1);
    return Intcode(prog, input, pos + 2);
  }
  if (opcode === 5) {
    console.log('Current IntCode:', prog[pos], prog[pos + 1], prog[pos + 2]);
    console.log('opcode:', opcode, 'Change Position if not 0');
    console.log('Perform:', paramRead1 !== 0);
    console.log('New Pos:', paramRead2);
    if (paramRead1 !== 0) {
      return Intcode(prog, paramRead2);
    }
    return Intcode(prog, input, pos + 3);
  }
  if (opcode === 6) {
    console.log('Current IntCode:', prog[pos], prog[pos + 1], prog[pos + 2]);
    console.log('opcode:', opcode, 'Change Position if 0');
    console.log('Perform:', paramRead1 === 0);
    console.log('New Pos:', paramRead2);
    if (paramRead1 === 0) {
      return Intcode(prog, paramRead2);
    }
    return Intcode(prog, input, pos + 3);
  }
  if (opcode === 7) {
    console.log(
      'Current IntCode:',
      prog[pos],
      prog[pos + 1],
      prog[pos + 2],
      prog[pos + 3]
    );
    console.log('opcode:', opcode, '1 smaller then 2');
    console.log('Before Write:', prog[paramWrite3]);
    if (!pMode1) console.log('Remote Value 1:', paramRead1);
    if (!pMode2) console.log('Remote Value 2:', paramRead2);
    console.log('Value:', paramRead1 < paramRead2 ? 1 : 0);
    prog[paramWrite3] = paramRead1 < paramRead2 ? 1 : 0;
    console.log('After Write:', prog[paramWrite3]);
    return Intcode(prog, input, pos + 4);
  }
  if (opcode === 8) {
    console.log(
      'Current IntCode:',
      prog[pos],
      prog[pos + 1],
      prog[pos + 2],
      prog[pos + 3]
    );
    console.log('opcode:', opcode, '1 equal to 2');
    console.log('Before Write:', prog[paramWrite3]);
    if (!pMode1) console.log('Remote Value 1:', paramRead1);
    if (!pMode2) console.log('Remote Value 2:', paramRead2);
    console.log('Value:', paramRead1 === paramRead2 ? 1 : 0);
    prog[paramWrite3] = paramRead1 === paramRead2 ? 1 : 0;
    console.log('After Write:', prog[paramWrite3]);
    return Intcode(prog, input, pos + 4);
  }
  if (opcode === 99) {
    return prog;
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
