/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var isGlob = require('./');

describe('isGlob', function () {
  describe('glob patterns', function () {
    it('should return `true` if it is a glob pattern:', function () {
      assert(isGlob('*.js'));
      assert(isGlob('!*.js'));
      assert(isGlob('!foo'));
      assert(isGlob('!foo.js'));
      assert(isGlob('**/abc.js'));
      assert(isGlob('abc/*.js'));
    });

    it('should return `false` if it is not a string:', function () {
      assert(!isGlob());
      assert(!isGlob(null));
      assert(!isGlob(['**/*.js']));
      assert(!isGlob(['foo.js']));
    });

    it('should return `false` if it is not a glob pattern:', function () {
      assert(!isGlob('.'));
      assert(!isGlob('aa'));
      assert(!isGlob('abc.js'));
      assert(!isGlob('abc/def/ghi.js'));
    });
  });

  describe('brace patterns', function () {
    it('should return `true` if the path has brace characters:', function () {
      assert(isGlob('abc/{a,b}.js'));
      assert(isGlob('abc/{a..z}.js'));
      assert(isGlob('abc/{a..z..2}.js'));
    });
  });

  describe('regex patterns', function () {
    it('should return `true` if the path has regex characters:', function () {
      assert(isGlob('abc/(aaa|bbb).js'));
      assert(isGlob('abc/?.js'));
      assert(isGlob('?.js'));
      assert(isGlob('[abc].js'));
      assert(isGlob('[^abc].js'));
      assert(isGlob('a/b/c/[a-z].js'));
      assert(isGlob('[a-j]*[^c]b/c'));
    });
  });

  describe('extglob patterns', function () {
    it('should return `true` if it has an extglob:', function () {
      assert(isGlob('abc/@(a).js'));
      assert(isGlob('abc/!(a).js'));
      assert(isGlob('abc/+(a).js'));
      assert(isGlob('abc/*(a).js'));
      assert(isGlob('abc/?(a).js'));
    });

    it('should return `true` if it has extglob characters and is not valid path:', function () {
      assert(isGlob('abc/!.js'));
      assert(isGlob('abc/*.js'));
      assert(isGlob('abc/?.js'));
    });

    it('should return `false` if it has extglob characters but is a valid path:', function () {
      assert(!isGlob('abc/@.js'));
      assert(!isGlob('abc/+.js'));
    });
  });
});

