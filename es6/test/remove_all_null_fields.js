'use strict';
const clean = require('../lib/index.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const test = require('unit.js');

describe("remove_all_null_fields", function() {
  it('removes all properties with null values', function() {
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
      g: {},
    };
    const result = clean.remove_all_null_fields(input);
    test.object(result)
      .notHasValue(null)
      .hasLength(6)
      .hasProperties(['a', 'b', 'd', 'e', 'f', 'g'])
      .is(expected);
  });
});