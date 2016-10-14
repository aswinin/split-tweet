'use strict';

const test = require('unit.js');
const describe = require('mocha').describe;
const it = require('mocha').it;
const clean = require('../lib/index.js').clean;

describe("clean", function() {

  it('for a tweet, removes all properties that are redundant, unecessary or with null/empty values', function() {
    const input = { 
      a: 1, 
      b: 0, 
      'id_str': 1,
      'in_reply_to_status_id_str': 1,
      'in_reply_to_user_id_str': 1,
      'geo': 1,
      c: null, 
      d: undefined,
      e: [], 
      f: {},
      g: { h: null, j: undefined, k: '', n: [ {}, {} ], o: { p: { q: {} } } },
      i: '',
      l: { m: false },
      r: [ 0, undefined, '', [], { undefined } ],
    };
    const expected = { 
      a: 1, 
      b: 0, 
      l: { m: false },
      r: [ 0 ],
    };
    const result = clean('tweet', input);
    test.object(result).is(expected);
  });

  it('for a user, removes all properties that are redundant, unecessary or with null/empty values', function() {
    const input = { 
      a: 1, 
      b: 0, 
      'id_str': 1,
      'profile_background_image_url_https': 1,
      'profile_image_url_https': 1,
      'profile_background_color': 1,
      'profile_background_tile': 1,
      'profile_link_color': 1,
      'profile_sidebar_border_color': 1,
      'profile_sidebar_fill_color': 1,
      'profile_text_color': 1,
      c: null, 
      d: undefined,
      e: [], 
      f: {},
      g: { h: null, j: undefined, k: '', n: [ {}, {} ], o: { p: { q: {} } } },
      i: '',
      l: { m: false },
      r: [ 0, undefined, '', [], { undefined } ],
    };
    const expected = { 
      a: 1, 
      b: 0, 
      l: { m: false },
      r: [ 0 ],
    };
    const result = clean('user', input);
    test.object(result).is(expected);
  });

  it('for a media, removes all properties that are redundant, unecessary or with null/empty values', function() {
    const input = { 
      a: 1, 
      b: 0, 
      'id_str': 1,
      'media_url_https': 1,
      'display_url': 1,
      'expanded_url': 1,
      'sizes': 1,
      c: null, 
      d: undefined,
      e: [], 
      f: {},
      g: { h: null, j: undefined, k: '', n: [ {}, {} ], o: { p: { q: {} } } },
      i: '',
      l: { m: false },
      r: [ 0, undefined, '', [], { undefined } ],
    };
    const expected = { 
      a: 1, 
      b: 0, 
      l: { m: false },
      r: [ 0 ],
    };
    const result = clean('media', input);
    test.object(result).is(expected);
  });

});
