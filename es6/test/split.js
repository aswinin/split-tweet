'use strict';
const clean = require('../lib/index.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const test = require('unit.js');

describe('Simple tweet contains only a user', function( ) {
  it('splits into two parts', function() {
    const tweet = {
      id: 1234,
      text: 'Yes',
      user: {
        id: 5678,
        login: 'toto',
      },
    };
    const result = clean.split(tweet);
    test
      .object(result);
  });
});
