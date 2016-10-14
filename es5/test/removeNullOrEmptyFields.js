'use strict';

var test = require('unit.js');
var describe = require('mocha').describe;
var it = require('mocha').it;
var removeNullOrEmptyFields = require('../lib/index.js').removeNullOrEmptyFields;

describe("removeNullOrEmptyFields", function () {

  it('removes all properties with null values or empty fields', function () {
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
    var result = removeNullOrEmptyFields(input);
    test.object(result).is(expected);
  });
});