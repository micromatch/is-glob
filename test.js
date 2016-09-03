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

describe('isGlob', function() {
  describe('glob patterns', function() {
    it('should return `true` if it is a glob pattern:', function() {
      assert(isGlob('*.js'));
      assert(isGlob('!*.js'));
      assert(isGlob('!foo'));
      assert(isGlob('!foo.js'));
      assert(isGlob('**/abc.js'));
      assert(isGlob('abc/*.js'));
    });

    it('should not match escaped globs', function() {
      assert(!isGlob('\\!\\*.js'));
      assert(!isGlob('\\!foo'));
      assert(!isGlob('\\!foo.js'));
      assert(!isGlob('\\*(foo).js'));
      assert(!isGlob('\\*.js'));
      assert(!isGlob('\\*\\*/abc.js'));
      assert(!isGlob('abc/\\*.js'));
    });

    it('should return `false` if the value is not a string:', function() {
      assert(!isGlob());
      assert(!isGlob(null));
      assert(!isGlob(['**/*.js']));
      assert(!isGlob(['foo.js']));
    });

    it('should return `false` if it is not a glob pattern:', function() {
      assert(!isGlob(''));
      assert(!isGlob('+~(abc)'));
      assert(!isGlob('.'));
      assert(!isGlob('@.(abc)'));
      assert(!isGlob('aa'));
      assert(!isGlob('abc!/def/!ghi.js'));
      assert(!isGlob('abc.js'));
      assert(!isGlob('abc/def/!ghi.js'));
      assert(!isGlob('abc/def/ghi.js'));
    });
  });

  describe('brace patterns', function() {
    it('should return `true` if the path has brace characters:', function() {
      assert(isGlob('abc/{a,b}.js'));
      assert(isGlob('abc/{a..z}.js'));
      assert(isGlob('abc/{a..z..2}.js'));
    });
  });

  describe('regex patterns', function() {
    it('should return `true` if the path has regex characters:', function() {
      assert(isGlob('!&(abc)'));
      assert(isGlob('!*.js'));
      assert(isGlob('!foo'));
      assert(isGlob('!foo.js'));
      assert(isGlob('**/abc.js'));
      assert(isGlob('*.js'));
      assert(isGlob('*z(abc)'));
      assert(isGlob('? (abc)'));
      assert(isGlob('?.js'));
      assert(isGlob('[1-10].js'));
      assert(isGlob('[^abc].js'));
      assert(isGlob('[a-j]*[^c]b/c'));
      assert(isGlob('[abc].js'));
      assert(isGlob('a/b/c/[a-z].js'));
      assert(isGlob('abc/(aaa|bbb).js'));
      assert(isGlob('abc/*.js'));
      assert(isGlob('abc/?.js'));
      assert(isGlob('abc/{a,b}.js'));
      assert(isGlob('abc/{a..z..2}.js'));
      assert(isGlob('abc/{a..z}.js'));
    });

    it('should return `false` if regex characters are escaped', function() {
      assert(!isGlob('abc/\\(aaa|bbb).js'));
      assert(!isGlob('abc/\\?.js'));
      assert(!isGlob('\\?.js'));
      assert(!isGlob('\\[abc\\].js'));
      assert(!isGlob('\\[1-10\\].js'));
      assert(!isGlob('\\[^abc\\].js'));
      assert(!isGlob('\\a/b/c/\\[a-z\\].js'));
      assert(!isGlob('\\[a-j\\]\\*\\[^c\\]b/c'));
    });
  });

  describe('extglob patterns', function() {
    it('should return `true` if it has an extglob:', function() {
      assert(isGlob('abc/@(a).js'));
      assert(isGlob('abc/!(a).js'));
      assert(isGlob('abc/+(a).js'));
      assert(isGlob('abc/*(a).js'));
      assert(isGlob('abc/?(a).js'));
    });

    it('should return `false` if extglob characters are escaped:', function() {
      assert(!isGlob('abc/\\@(a).js'));
      assert(!isGlob('abc/\\!(a).js'));
      assert(!isGlob('abc/\\+(a).js'));
      assert(!isGlob('abc/\\*(a).js'));
      assert(!isGlob('abc/\\?(a).js'));
    });

    it('should return `true` if it has glob characters and is not a valid path:', function() {
      assert(isGlob('abc/[*].js'));
      assert(isGlob('abc/*.js'));
      assert(isGlob('abc/?.js'));
    });

    it('should return `false` if it is a valid non-glob path:', function() {
      assert(!isGlob('abc/!.js'));
      assert(!isGlob('abc/@.js'));
      assert(!isGlob('abc/+.js'));
    });
  });

  describe('isGlob', function () {
    it('should return true when the string has an extglob:', function () {
      assert(isGlob('?(abc)'));
      assert(isGlob('@(abc)'));
      assert(isGlob('!(abc)'));
      assert(isGlob('*(abc)'));
      assert(isGlob('+(abc)'));
      assert(isGlob('xyz/?(abc)/xyz'));
      assert(isGlob('xyz/@(abc)/xyz'));
      assert(isGlob('xyz/!(abc)/xyz'));
      assert(isGlob('xyz/*(abc)/xyz'));
      assert(isGlob('xyz/+(abc)/xyz'));
      assert(isGlob('?(abc|xyz)/xyz'));
      assert(isGlob('@(abc|xyz)'));
      assert(isGlob('!(abc|xyz)'));
      assert(isGlob('*(abc|xyz)'));
      assert(isGlob('+(abc|xyz)'));
    });

    it('should not match escaped extglobs', function () {
      assert(!isGlob('\\?(abc)'));
      assert(!isGlob('\\@(abc)'));
      assert(!isGlob('\\!(abc)'));
      assert(!isGlob('\\*(abc)'));
      assert(!isGlob('\\+(abc)'));
      assert(!isGlob('xyz/\\?(abc)/xyz'));
      assert(!isGlob('xyz/\\@(abc)/xyz'));
      assert(!isGlob('xyz/\\!(abc)/xyz'));
      assert(!isGlob('xyz/\\*(abc)/xyz'));
      assert(!isGlob('xyz/\\+(abc)/xyz'));
    });

    it('should detect when an glob is in the same pattern as an escaped glob', function () {
      assert(isGlob('\\?(abc|xyz)/xyz'));
      assert(isGlob('\\@(abc|xyz)'));
      assert(isGlob('\\!(abc|xyz)'));
      assert(isGlob('\\*(abc|xyz)'));
      assert(isGlob('\\+(abc|xyz)'));
      assert(isGlob('\\?(abc)/?(abc)'));
      assert(isGlob('\\@(abc)/@(abc)'));
      assert(isGlob('\\!(abc)/!(abc)'));
      assert(isGlob('\\*(abc)/*(abc)'));
      assert(isGlob('\\+(abc)/+(abc)'));
      assert(isGlob('xyz/\\?(abc)/xyz/def/?(abc)/xyz'));
      assert(isGlob('xyz/\\@(abc)/xyz/def/@(abc)/xyz'));
      assert(isGlob('xyz/\\!(abc)/xyz/def/!(abc)/xyz'));
      assert(isGlob('xyz/\\*(abc)/xyz/def/*(abc)/xyz'));
      assert(isGlob('xyz/\\+(abc)/xyz/def/+(abc)/xyz'));
      assert(isGlob('\\?(abc|xyz)/xyz/?(abc|xyz)/xyz'));
      assert(isGlob('\\@(abc|xyz)/@(abc|xyz)'));
      assert(isGlob('\\!(abc|xyz)/!(abc|xyz)'));
      assert(isGlob('\\*(abc|xyz)/*(abc|xyz)'));
      assert(isGlob('\\+(abc|xyz)/+(abc|xyz)'));
    });
  });
});

