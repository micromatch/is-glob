'use strict';

if (!global.BigInt) {
  console.log('Benchmark requirest 10.x or newer.');
  process.exit(0);
}

const assert = require('assert');
var isGlob = require('./');

function runBenchmark(length) {
  const start = process.hrtime.bigint();
  ['(', '[', '{', '\\'].forEach((char) => {
    isGlob(char.repeat(length));
    isGlob(char.repeat(length), {strict: false});
  });
  return process.hrtime.bigint() - start;
}

const baseline = runBenchmark(1e6);
console.log(`Benchmark took ${baseline / global.BigInt(1000000)} milliseconds.`);

assert.ok(baseline < global.BigInt(1000000000), 'Benchmark goal is less than one second');
