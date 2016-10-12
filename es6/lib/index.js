'use strict';

const traverse = require('traverse');
const diff = require('deep-diff').diff;

function remove_null_fields(tweet) {
  Object.keys(tweet).forEach(
    field => { if ( tweet[field] === null ) { delete tweet[field]; } }
  );
  return tweet;
}

function remove_all_null_fields(tweet) {
  traverse(tweet).forEach(function (x) {
    if (x === null) { this.remove(); }
  });
  return tweet;
}

function keep_only_fields_with_data(tweet) {
  let tweet0, tweet1 = Object.assign({}, tweet);
  while ( diff(tweet1, tweet0) ) {
    tweet0 = Object.assign({}, tweet1);
    tweet1 = traverse(tweet1).forEach(function (x) {
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
  return tweet1;
}

function split(tweet) {
  return tweet;
}

module.exports = { 
  remove_null_fields, 
  remove_all_null_fields, 
  keep_only_fields_with_data,
  split,
};
