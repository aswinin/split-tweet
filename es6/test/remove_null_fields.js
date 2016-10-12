'use strict';
const clean = require('../lib/index.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const test = require('unit.js');

describe("remove_null_fields", function() {
  it('removes a property with null values only on the first level', function() {
    const input = { 
      a: 1, 
      b: 0, 
      c: null, 
      d: undefined,
      e: [], 
      f: {},
      g: { h: null },
    };
    test.object(input)
        .hasLength(7)
        .hasProperties(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    test.object(input).hasValue(null);
    const expected = { 
      a: 1, 
      b: 0, 
      d: undefined, 
      e: [], 
      f: {}, 
      g: { h: null },
    };
    const result = clean.remove_null_fields(input);
    test.object(result)
      .notHasValue(null)
      .hasLength(6)
      .hasProperties(['a', 'b', 'd', 'e', 'f', 'g'])
      .is(expected);
  });
  it('removes all properties with null values only on the first level', function() {
    const input = { 
      a: 1, 
      b: 0, 
      c: null, 
      d: undefined, 
      e: [], 
      f: {},
      g: null,
      h: 23,
      i: null,
    };
    const expected = { 
      a: 1, 
      b: 0, 
      d: undefined, 
      e: [], 
      f: {},
      h: 23,
    };
    test.object(input)
        .hasLength(9)
        .hasProperties(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']);
    const result = clean.remove_null_fields(input);
    test
      .object(result)
        .hasLength(6)
        .hasProperties(['a', 'b', 'd', 'e', 'f', 'h'])
        .is(expected);
  });
});
