'use strict';

if (!global.BigInt) {
  console.log('Benchmark requirest 10.x or newer.');
  process.exit(0);
}

var assert = require('assert');
var isGlob = require('./');

function runBenchmark(length) {
  var start = process.hrtime.bigint();
  ['(', '[', '{', '\\'].forEach(function(char) {
    isGlob(char.repeat(length));
    isGlob(char.repeat(length), {strict: false});
  });
  return process.hrtime.bigint() - start;
}

var baseline = runBenchmark(1e6);
console.log('Benchmark took ' + baseline / global.BigInt(1000000) + ' milliseconds.');

assert.ok(baseline < global.BigInt(1000000000), 'Benchmark goal is less than one second');
