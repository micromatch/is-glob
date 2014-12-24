/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var isGlob = require('./');

describe('isGlob', function () {
  it('should return `true` if it is a glob pattern:', function () {
    isGlob('*.js').should.be.true;
    isGlob('**/abc.js').should.be.true;
    isGlob('abc/*.js').should.be.true;
    isGlob('abc/(aaa|bbb).js').should.be.true;
    isGlob('abc/{a,b}.js').should.be.true;
    isGlob('abc/?.js').should.be.true;
    isGlob('?.js').should.be.true;
    isGlob('[foo].js').should.be.true;
  });

  it('should return `false` if it is not a string:', function () {
    isGlob().should.be.false;
    isGlob(null).should.be.false;
    isGlob(['**/*.js']).should.be.false;
    isGlob(['foo.js']).should.be.false;
  });

  it('should return `false` if it is not a glob pattern:', function () {
    isGlob('abc.js').should.be.false;
    isGlob('abc/def/ghi.js').should.be.false;
  });
});

