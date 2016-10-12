'use strict';

function remove_null_fields(tweet) {
  Object.keys(tweet).forEach(
    field => { if ( tweet[field] === null ) { delete tweet[field]; } }
  );
  return tweet;
}

function split(tweet) {
  return tweet;
}

module.exports = { remove_null_fields: remove_null_fields, split };