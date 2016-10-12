'use strict';

const traverse = require('traverse');
const clone = require('clone');
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
  let tweet0;
  console.log('--original--');
  console.log(tweet);
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
    console.log('--step--');
    console.log(tweet);
    console.log(tweet0);
    console.log(diff(tweet0, tweet));
  }
  return tweet;
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
