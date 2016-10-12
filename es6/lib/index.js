'use strict';

const traverse = require('traverse');

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

function split(tweet) {
  return tweet;
}

module.exports = { 
  remove_null_fields, 
  remove_all_null_fields, 
  split,
};
