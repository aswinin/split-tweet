'use strict';
const clean = require('../lib/index.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const test = require('unit.js');

describe("keep_only_fields_with_data", function() {
  it('removes all properties with null values or void', function() {
    const input = { 
      a: 1, 
      b: 0, 
      c: null, 
      d: undefined,
      e: [], 
      f: {},
      g: { h: null, j: undefined, k: '', n: [ {}, {} ], o: { p: { q: {} } } },
      i: '',
      l: { m: false },
    };
    const expected = { 
      a: 1, 
      b: 0, 
      l: { m: false },
    };
    const result = clean.keep_only_fields_with_data(input);
    test.object(result).is(expected);
  });
});
