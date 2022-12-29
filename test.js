/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict'

const assert = require('assert')
const isGlob = require('./')

describe('isGlob', function () {
  describe('glob patterns', function () {
    it('should be true if it is a glob pattern:', function () {
      assert(!isGlob('@.(?abc)'), 'invalid pattern')
      assert(isGlob('*.js'))
      assert(isGlob('!*.js'))
      assert(isGlob('!foo'))
      assert(isGlob('!foo.js'))
      assert(isGlob('**/abc.js'))
      assert(isGlob('abc/*.js'))
      assert(isGlob('@.(?:abc)'))
      assert(isGlob('@.(?!abc)'))
    })

    it('should not match escaped globs', function () {
      assert(!isGlob('\\!\\*.js'))
      assert(!isGlob('\\!foo'))
      assert(!isGlob('\\!foo.js'))
      assert(!isGlob('\\*(foo).js'))
      assert(!isGlob('\\*.js'))
      assert(!isGlob('\\*\\*/abc.js'))
      assert(!isGlob('abc/\\*.js'))
    })

    it('should be false if the value is not a string:', function () {
      assert(!isGlob())
      assert(!isGlob(null))
      assert(!isGlob(['**/*.js']))
      assert(!isGlob(['foo.js']))
    })

    it('should be false if it is not a glob pattern:', function () {
      assert(!isGlob(''))
      assert(!isGlob('~/abc'))
      assert(!isGlob('~/abc'))
      assert(!isGlob('~/(abc)'))
      assert(!isGlob('+~(abc)'))
      assert(!isGlob('.'))
      assert(!isGlob('@.(abc)'))
      assert(!isGlob('aa'))
      assert(!isGlob('who?'))
      assert(!isGlob('why!?'))
      assert(!isGlob('where???'))
      assert(!isGlob('abc!/def/!ghi.js'))
      assert(!isGlob('abc.js'))
      assert(!isGlob('abc/def/!ghi.js'))
      assert(!isGlob('abc/def/ghi.js'))
    })
  })

  describe('regex capture groups', function () {
    it('should be true if the path has a regex capture group:', function () {
      assert(isGlob('abc/(?!foo).js'))
      assert(isGlob('abc/(?:foo).js'))
      assert(isGlob('abc/(?=foo).js'))
      assert(isGlob('abc/(a|b).js'))
      assert(isGlob('abc/(a|b|c).js'))
      assert(isGlob('abc/(foo bar)/*.js'), 'not a capture group but has a glob')
    })

    it('should be true if the path has parens but is not a valid capture group', function () {
      assert(!isGlob('abc/(?foo).js'), 'invalid capture group')
      assert(!isGlob('abc/(a b c).js'), 'unlikely to be a capture group')
      assert(!isGlob('abc/(ab).js'), 'unlikely to be a capture group')
      assert(!isGlob('abc/(abc).js'), 'unlikely to be a capture group')
      assert(!isGlob('abc/(foo bar).js'), 'unlikely to be a capture group')
    })

    it('should be false if the capture group is imbalanced:', function () {
      assert(!isGlob('abc/(?ab.js'))
      assert(!isGlob('abc/(ab.js'))
      assert(!isGlob('abc/(a|b.js'))
      assert(!isGlob('abc/(a|b|c.js'))
    })

    it('should be false if the group is escaped:', function () {
      assert(!isGlob('abc/\\(a|b).js'))
      assert(!isGlob('abc/\\(a|b|c).js'))
    })

    it('should be true if glob chars exist and `options.strict` is false', function () {
      assert(isGlob('$(abc)', { strict: false }))
      assert(isGlob('&(abc)', { strict: false }))
      assert(isGlob('? (abc)', { strict: false }))
      assert(isGlob('?.js', { strict: false }))
      assert(isGlob('abc/(?ab.js', { strict: false }))
      assert(isGlob('abc/(ab.js', { strict: false }))
      assert(isGlob('abc/(a|b.js', { strict: false }))
      assert(isGlob('abc/(a|b|c.js', { strict: false }))
      assert(isGlob('abc/(foo).js', { strict: false }))
      assert(isGlob('abc/?.js', { strict: false }))
      assert(isGlob('abc/[1-3.js', { strict: false }))
      assert(isGlob('abc/[^abc.js', { strict: false }))
      assert(isGlob('abc/[abc.js', { strict: false }))
      assert(isGlob('abc/foo?.js', { strict: false }))
      assert(isGlob('abc/{abc.js', { strict: false }))
      assert(isGlob('Who?.js', { strict: false }))
    })

    it('should be false if the first delim is escaped and options.strict is false:', function () {
      assert(!isGlob('abc/\\(a|b).js', { strict: false }))
      assert(!isGlob('abc/(a|b\\).js'))
      assert(!isGlob('abc/\\(a|b|c).js', { strict: false }))
      assert(!isGlob('abc/\\(a|b|c.js', { strict: false }))
      assert(!isGlob('abc/\\[abc].js', { strict: false }))
      assert(!isGlob('abc/\\[abc.js', { strict: false }))

      assert(isGlob('abc/(a|b\\).js', { strict: false }))
    })
  })

  describe('regex character classes', function () {
    it('should be true if the path has a regex character class:', function () {
      assert(isGlob('abc/[abc].js'))
      assert(isGlob('abc/[^abc].js'))
      assert(isGlob('abc/[1-3].js'))
    })

    it('should be false if the character class is not balanced:', function () {
      assert(!isGlob('abc/[abc.js'))
      assert(!isGlob('abc/[^abc.js'))
      assert(!isGlob('abc/[1-3.js'))
    })

    it('should be false if the character class is escaped:', function () {
      assert(!isGlob('abc/\\[abc].js'))
      assert(!isGlob('abc/\\[^abc].js'))
      assert(!isGlob('abc/\\[1-3].js'))
    })
  })

  describe('brace patterns', function () {
    it('should be true if the path has brace characters:', function () {
      assert(isGlob('abc/{a,b}.js'))
      assert(isGlob('abc/{a..z}.js'))
      assert(isGlob('abc/{a..z..2}.js'))
    })

    it('should be false if (basic) braces are not balanced:', function () {
      assert(!isGlob('abc/\\{a,b}.js'))
      assert(!isGlob('abc/\\{a..z}.js'))
      assert(!isGlob('abc/\\{a..z..2}.js'))
    })
  })

  describe('regex patterns', function () {
    it('should be true if the path has regex characters:', function () {
      assert(!isGlob('$(abc)'))
      assert(!isGlob('&(abc)'))
      assert(!isGlob('Who?.js'))
      assert(!isGlob('? (abc)'))
      assert(!isGlob('?.js'))
      assert(!isGlob('abc/?.js'))

      assert(isGlob('!&(abc)'))
      assert(isGlob('!*.js'))
      assert(isGlob('!foo'))
      assert(isGlob('!foo.js'))
      assert(isGlob('**/abc.js'))
      assert(isGlob('*.js'))
      assert(isGlob('*z(abc)'))
      assert(isGlob('[1-10].js'))
      assert(isGlob('[^abc].js'))
      assert(isGlob('[a-j]*[^c]b/c'))
      assert(isGlob('[abc].js'))
      assert(isGlob('a/b/c/[a-z].js'))
      assert(isGlob('abc/(aaa|bbb).js'))
      assert(isGlob('abc/*.js'))
      assert(isGlob('abc/{a,b}.js'))
      assert(isGlob('abc/{a..z..2}.js'))
      assert(isGlob('abc/{a..z}.js'))
    })

    it('should be false if regex characters are escaped', function () {
      assert(!isGlob('\\?.js'))
      assert(!isGlob('\\[1-10\\].js'))
      assert(!isGlob('\\[^abc\\].js'))
      assert(!isGlob('\\[a-j\\]\\*\\[^c\\]b/c'))
      assert(!isGlob('\\[abc\\].js'))
      assert(!isGlob('\\a/b/c/\\[a-z\\].js'))
      assert(!isGlob('abc/\\(aaa|bbb).js'))
      assert(!isGlob('abc/\\?.js'))
    })
  })

  describe('extglob patterns', function () {
    it('should be true if it has an extglob:', function () {
      assert(isGlob('abc/!(a).js'))
      assert(isGlob('abc/!(a|b).js'))
      assert(isGlob('abc/(ab)*.js'))
      assert(isGlob('abc/(a|b).js'))
      assert(isGlob('abc/*(a).js'))
      assert(isGlob('abc/*(a|b).js'))
      assert(isGlob('abc/+(a).js'))
      assert(isGlob('abc/+(a|b).js'))
      assert(isGlob('abc/?(a).js'))
      assert(isGlob('abc/?(a|b).js'))
      assert(isGlob('abc/@(a).js'))
      assert(isGlob('abc/@(a|b).js'))
    })

    it('should be false if extglob characters are escaped:', function () {
      assert(!isGlob('abc/\\*.js'))
      assert(!isGlob('abc/\\*\\*.js'))
      assert(!isGlob('abc/\\@(a).js'))
      assert(!isGlob('abc/\\!(a).js'))
      assert(!isGlob('abc/\\+(a).js'))
      assert(!isGlob('abc/\\*(a).js'))
      assert(!isGlob('abc/\\?(a).js'))
      assert(isGlob('abc/\\@(a|b).js'), 'matches since extglob is not escaped')
      assert(isGlob('abc/\\!(a|b).js'), 'matches since extglob is not escaped')
      assert(isGlob('abc/\\+(a|b).js'), 'matches since extglob is not escaped')
      assert(isGlob('abc/\\*(a|b).js'), 'matches since extglob is not escaped')
      assert(isGlob('abc/\\?(a|b).js'), 'matches since extglob is not escaped')
      assert(
        isGlob('abc/\\@(a\\|b).js'),
        'matches since extglob is not escaped'
      )
      assert(
        isGlob('abc/\\!(a\\|b).js'),
        'matches since extglob is not escaped'
      )
      assert(
        isGlob('abc/\\+(a\\|b).js'),
        'matches since extglob is not escaped'
      )
      assert(
        isGlob('abc/\\*(a\\|b).js'),
        'matches since extglob is not escaped'
      )
      assert(
        isGlob('abc/\\?(a\\|b).js'),
        'matches since extglob is not escaped'
      )
    })

    it('should not return true for non-extglob parens', function () {
      assert(!isGlob('C:/Program Files (x86)/'))
    })

    it('should be true if it has glob characters and is not a valid path:', function () {
      assert(isGlob('abc/[*].js'))
      assert(isGlob('abc/*.js'))
    })

    it('should be false if it is a valid non-glob path:', function () {
      assert(!isGlob('abc/?.js'))
      assert(!isGlob('abc/!.js'))
      assert(!isGlob('abc/@.js'))
      assert(!isGlob('abc/+.js'))
    })
  })

  describe('isGlob', function () {
    it('should return true when the string has an extglob:', function () {
      assert(isGlob('?(abc)'))
      assert(isGlob('@(abc)'))
      assert(isGlob('!(abc)'))
      assert(isGlob('*(abc)'))
      assert(isGlob('+(abc)'))
      assert(isGlob('xyz/?(abc)/xyz'))
      assert(isGlob('xyz/@(abc)/xyz'))
      assert(isGlob('xyz/!(abc)/xyz'))
      assert(isGlob('xyz/*(abc)/xyz'))
      assert(isGlob('xyz/+(abc)/xyz'))
      assert(isGlob('?(abc|xyz)/xyz'))
      assert(isGlob('@(abc|xyz)'))
      assert(isGlob('!(abc|xyz)'))
      assert(isGlob('*(abc|xyz)'))
      assert(isGlob('+(abc|xyz)'))
    })

    it('should not match escaped extglobs', function () {
      assert(!isGlob('\\?(abc)'))
      assert(!isGlob('\\@(abc)'))
      assert(!isGlob('\\!(abc)'))
      assert(!isGlob('\\*(abc)'))
      assert(!isGlob('\\+(abc)'))
      assert(!isGlob('xyz/\\?(abc)/xyz'))
      assert(!isGlob('xyz/\\@(abc)/xyz'))
      assert(!isGlob('xyz/\\!(abc)/xyz'))
      assert(!isGlob('xyz/\\*(abc)/xyz'))
      assert(!isGlob('xyz/\\+(abc)/xyz'))
    })

    it('should detect when an glob is in the same pattern as an escaped glob', function () {
      assert(isGlob('\\?(abc|xyz)/xyz'))
      assert(isGlob('\\@(abc|xyz)'))
      assert(isGlob('\\!(abc|xyz)'))
      assert(isGlob('\\*(abc|xyz)'))
      assert(isGlob('\\+(abc|xyz)'))
      assert(isGlob('\\?(abc)/?(abc)'))
      assert(isGlob('\\@(abc)/@(abc)'))
      assert(isGlob('\\!(abc)/!(abc)'))
      assert(isGlob('\\*(abc)/*(abc)'))
      assert(isGlob('\\+(abc)/+(abc)'))
      assert(isGlob('xyz/\\?(abc)/xyz/def/?(abc)/xyz'))
      assert(isGlob('xyz/\\@(abc)/xyz/def/@(abc)/xyz'))
      assert(isGlob('xyz/\\!(abc)/xyz/def/!(abc)/xyz'))
      assert(isGlob('xyz/\\*(abc)/xyz/def/*(abc)/xyz'))
      assert(isGlob('xyz/\\+(abc)/xyz/def/+(abc)/xyz'))
      assert(isGlob('\\?(abc|xyz)/xyz/?(abc|xyz)/xyz'))
      assert(isGlob('\\@(abc|xyz)/@(abc|xyz)'))
      assert(isGlob('\\!(abc|xyz)/!(abc|xyz)'))
      assert(isGlob('\\*(abc|xyz)/*(abc|xyz)'))
      assert(isGlob('\\+(abc|xyz)/+(abc|xyz)'))
    })
  })
})
