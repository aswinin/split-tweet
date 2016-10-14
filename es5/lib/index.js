'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('babel-polyfill');

var _marked = [split].map(regeneratorRuntime.mark);

var traverse = require('traverse');
var clone = require('clone');
var diff = require('deep-diff').diff;
var isSet = require("object-path").has;
var setNull = require("object-path").empty;

function redundantFields() {
  return {
    tweet: ['id_str', 'in_reply_to_status_id_str', 'in_reply_to_user_id_str', 'geo'],
    user: ['id_str', 'profile_background_image_url_https', 'profile_image_url_https'],
    media: ['id_str', 'media_url_https']
  };
}

function unecessaryFields() {
  return {
    tweet: [],
    user: ['profile_background_color', 'profile_background_tile', 'profile_link_color', 'profile_sidebar_border_color', 'profile_sidebar_fill_color', 'profile_text_color'],
    media: ['display_url', 'expanded_url', 'sizes']
  };
}

function isNullOrEmpty(x) {
  return x === null || x === undefined || x === '' || Array.isArray(x) && x.length === 0 || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && Object.getOwnPropertyNames(x).length === 0;
}

function removeNullOrEmptyFields(tweet) {
  var tweet0 = void 0;
  while (diff(tweet0, tweet)) {
    tweet0 = clone(tweet);
    tweet = traverse(tweet).forEach(function (x) {
      if (isNullOrEmpty(x)) {
        this.remove();
      }
    });
  }
  return tweet;
}

function removeRedundantUnecessaryNullOrEmptyFields(type, object) {
  for (var f in redundantFields[type]) {
    setNull(object, f);
  }
  for (var _f in unecessaryFields[type]) {
    setNull(object, _f);
  }
  return removeNullOrEmptyFields(object);
}

function split(receivedAt, collectId, tweet) {
  var retweetedId, quotedId, media, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, m, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _m, userId, user, bb, hasGeo, placeId, place;

  return regeneratorRuntime.wrap(function split$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!tweet.id) {
            _context.next = 91;
            break;
          }

          // Remove redundant fiels
          tweet = removeRedundantUnecessaryNullOrEmptyFields('tweet', tweet);
          // Retweet
          retweetedId = isSet(tweet, 'retweeted_status.id') ? tweet.retweeted_status.id : undefined;

          if (!retweetedId) {
            _context.next = 6;
            break;
          }

          return _context.delegateYield(split(receivedAt, collectId, tweet.retweeted_status), 't0', 5);

        case 5:
          delete tweet.retweeted_status;

        case 6:
          // Quoted tweet
          quotedId = isSet(tweet, 'quoted_status.id') ? tweet.quoted_status.id : undefined;

          if (!quotedId) {
            _context.next = 10;
            break;
          }

          return _context.delegateYield(split(receivedAt, collectId, tweet.quoted_status), 't1', 9);

        case 9:
          delete tweet.quoted_status;

        case 10:
          // Media
          media = new Set();

          if (!(isSet(tweet, 'entities.media.length') && tweet.entities.media.length > 0)) {
            _context.next = 41;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 15;
          _iterator = tweet.entities.media[Symbol.iterator]();

        case 17:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 26;
            break;
          }

          m = _step.value;

          m = removeRedundantUnecessaryNullOrEmptyFields('media', m);
          _context.next = 22;
          return {
            meta: {
              type: 'media',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { media: m },
            version: 1
          };

        case 22:
          media.add(m.id);

        case 23:
          _iteratorNormalCompletion = true;
          _context.next = 17;
          break;

        case 26:
          _context.next = 32;
          break;

        case 28:
          _context.prev = 28;
          _context.t2 = _context['catch'](15);
          _didIteratorError = true;
          _iteratorError = _context.t2;

        case 32:
          _context.prev = 32;
          _context.prev = 33;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 35:
          _context.prev = 35;

          if (!_didIteratorError) {
            _context.next = 38;
            break;
          }

          throw _iteratorError;

        case 38:
          return _context.finish(35);

        case 39:
          return _context.finish(32);

        case 40:
          delete tweet.entities.media;

        case 41:
          if (!(isSet(tweet, 'extended_entities.media.length') && tweet.extended_entities.media.length > 0)) {
            _context.next = 71;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 45;
          _iterator2 = tweet.extended_entities.media[Symbol.iterator]();

        case 47:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 56;
            break;
          }

          _m = _step2.value;

          if (media.has(_m.id)) {
            _context.next = 53;
            break;
          }

          _context.next = 52;
          return {
            meta: {
              type: 'media',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { media: _m },
            version: 1
          };

        case 52:
          media.add(_m.id);

        case 53:
          _iteratorNormalCompletion2 = true;
          _context.next = 47;
          break;

        case 56:
          _context.next = 62;
          break;

        case 58:
          _context.prev = 58;
          _context.t3 = _context['catch'](45);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t3;

        case 62:
          _context.prev = 62;
          _context.prev = 63;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 65:
          _context.prev = 65;

          if (!_didIteratorError2) {
            _context.next = 68;
            break;
          }

          throw _iteratorError2;

        case 68:
          return _context.finish(65);

        case 69:
          return _context.finish(62);

        case 70:
          delete tweet.extended_entities.media;

        case 71:
          // User
          userId = isSet(tweet, 'user.id') ? tweet.user.id : undefined;

          if (!userId) {
            _context.next = 77;
            break;
          }

          user = tweet.user;

          delete tweet.user;
          _context.next = 77;
          return {
            meta: {
              version: 1,
              type: 'user',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { user: user },
            version: 1
          };

        case 77:
          // Location
          bb = void 0;
          hasGeo = isSet(tweet, 'coordinates.coordinates');
          placeId = isSet(tweet, 'place.id') ? tweet.place.id : undefined;

          if (hasGeo) {
            // Point
            bb = tweet['coordinates'];
          }

          if (!placeId) {
            _context.next = 87;
            break;
          }

          place = tweet.place;

          if (!hasGeo) {
            bb = place.bounding_box;
            // Fermeture du polygone pour l'index
            bb.coordinates[0].push(bb.coordinates[0][0]);
          }
          delete tweet.place;
          // Place
          _context.next = 87;
          return {
            meta: {
              version: 1,
              type: 'place',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { place: place },
            version: 1
          };

        case 87:
          _context.next = 89;
          return {
            meta: {
              version: 1,
              type: 'tweet',
              receivedAt: receivedAt,
              createdAt: new Date(Number(tweet.timestamp_ms)),
              collectId: collectId,
              userId: userId,
              placeId: placeId,
              retweetedId: retweetedId,
              geo: bb,
              media: Array.from(media)
            },
            data: { tweet: tweet },
            version: 1
          };

        case 89:
          _context.next = 93;
          break;

        case 91:
          _context.next = 93;
          return {
            meta: {
              type: 'other',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { other: tweet },
            version: 1
          };

        case 93:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[15, 28, 32, 40], [33,, 35, 39], [45, 58, 62, 70], [63,, 65, 69]]);
}

module.exports = {
  isNullOrEmpty: isNullOrEmpty,
  removeNullOrEmptyFields: removeNullOrEmptyFields,
  removeRedundantUnecessaryNullOrEmptyFields: removeRedundantUnecessaryNullOrEmptyFields,
  split: split
};