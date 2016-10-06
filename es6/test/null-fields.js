'use strict';
const clean = require('../lib/index.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const test = require('unit.js');

describe('An object with a property sets to null', function( ) {
  it('should remove it', function() {
    const input = { 
      a: 1, 
      b: 0, 
      c: null, 
      d: undefined, 
      e: [], 
      f: {}, 
    };
    test
      .object(input)
        .hasLength(6)
        .hasProperties(['a', 'b', 'c', 'd', 'e', 'f']);
    const result = clean.remove_null_fields(input);
    test
      .object(result)
        .hasLength(5)
        .hasProperties(['a', 'b', 'd', 'e', 'f']);
  });
});

describe('An object with many propertie sets to null', function( ) {
  it('should remove them', function() {
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
    test
      .object(input)
        .hasLength(9)
        .hasProperties(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']);
    const result = clean.remove_null_fields(input);
    test
      .object(result)
        .hasLength(6)
        .hasProperties(['a', 'b', 'd', 'e', 'f', 'h']);
  });
});
