'use strict';

const traverse = require('traverse');
const clone = require('clone');
const diff = require('deep-diff').diff;

function keep_only_fields_with_data(tweet) {
  let tweet0;
  while ( diff(tweet0, tweet) ) {
    tweet0 = clone(tweet);
    tweet = traverse(tweet).forEach(function (x) {
      if ( 
        x === null || 
        x === undefined ||
        x === '' ||
        ( Array.isArray(x) && x.length === 0 ) ||
        ( typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0 )
      ) { 
        this.remove(); 
      }
    });
  }
  return tweet;
}

function split(tweet) {
  return tweet;
}

module.exports = { 
  keep_only_fields_with_data,
  split,
};
