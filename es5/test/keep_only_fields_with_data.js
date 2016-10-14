'use strict';

var test = require('unit.js');
var describe = require('mocha').describe;
var it = require('mocha').it;
var clean = require('../lib/index.js').keep_only_fields_with_data;

describe("keep_only_fields_with_data", function () {

  it('removes all properties with null values or void objects/arrays', function () {
    var input = {
      a: 1,
      b: 0,
      c: null,
      d: undefined,
      e: [],
      f: {},
      g: { h: null, j: undefined, k: '', n: [{}, {}], o: { p: { q: {} } } },
      i: '',
      l: { m: false },
      r: [0, undefined, '', [], { undefined: undefined }]
    };
    var expected = {
      a: 1,
      b: 0,
      l: { m: false },
      r: [0]
    };
    var result = clean(input);
    test.object(result).is(expected);
  });
});