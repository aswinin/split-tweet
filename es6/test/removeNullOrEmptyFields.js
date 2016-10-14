'use strict';

const test = require('unit.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const removeNullOrEmptyFields = require('../lib/index.js').removeNullOrEmptyFields;

describe("removeNullOrEmptyFields", function() {

  it('removes all properties with null values or empty fields', function() {
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
      r: [ 0, undefined, '', [], { undefined } ],
    };
    const expected = { 
      a: 1, 
      b: 0, 
      l: { m: false },
      r: [ 0 ],
    };
    const result = removeNullOrEmptyFields(input);
    test.object(result).is(expected);
  });

});
