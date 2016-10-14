'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('babel-polyfill');

var _marked = [split].map(regeneratorRuntime.mark);

var traverse = require('traverse');
var clone = require('clone');
var diff = require('deep-diff').diff;
var path = require("object-path");

var redundantFields = {
  tweet: ['id_str', 'in_reply_to_status_id_str', 'in_reply_to_user_id_str', 'quoted_status_id_str', 'geo'],
  user: ['id_str', 'profile_background_image_url_https', 'profile_image_url_https'],
  media: ['id_str', 'media_url_https']
};

var unecessaryFields = {
  tweet: [],
  user: ['profile_background_color', 'profile_background_tile', 'profile_link_color', 'profile_sidebar_border_color', 'profile_sidebar_fill_color', 'profile_text_color'],
  media: ['display_url', 'expanded_url', 'sizes']
};

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

function clean(type, object) {
  redundantFields[type].forEach(function (x) {
    return path.del(object, x);
  });
  unecessaryFields[type].forEach(function (x) {
    return path.del(object, x);
  });
  return removeNullOrEmptyFields(object);
}

function buildMediaObject(receivedAt, collectId, m) {
  m = clean('media', m);
  return {
    meta: {
      type: 'media',
      receivedAt: receivedAt,
      collectId: collectId
    },
    data: { media: m },
    version: 1
  };
}

function split(receivedAt, collectId, tweet) {
  var retweetedId, quotedId, media, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, m, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _m, userId, user, date, bb, hasGeo, placeId, place, createdAt;

  return regeneratorRuntime.wrap(function split$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!tweet.id) {
            _context.next = 94;
            break;
          }

          // Remove redundant fiels
          tweet = clean('tweet', tweet);
          // Retweet
          retweetedId = path.has(tweet, 'retweeted_status.id') ? tweet.retweeted_status.id : undefined;

          if (!retweetedId) {
            _context.next = 6;
            break;
          }

          return _context.delegateYield(split(receivedAt, collectId, tweet.retweeted_status), 't0', 5);

        case 5:
          delete tweet.retweeted_status;

        case 6:
          // Quoted tweet
          quotedId = path.has(tweet, 'quoted_status.id') ? tweet.quoted_status.id : undefined;

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

          if (!(path.has(tweet, 'entities.media.length') && tweet.entities.media.length > 0)) {
            _context.next = 40;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 15;
          _iterator = tweet.entities.media[Symbol.iterator]();

        case 17:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 25;
            break;
          }

          m = _step.value;
          _context.next = 21;
          return buildMediaObject(receivedAt, collectId, m);

        case 21:
          media.add(m.id);

        case 22:
          _iteratorNormalCompletion = true;
          _context.next = 17;
          break;

        case 25:
          _context.next = 31;
          break;

        case 27:
          _context.prev = 27;
          _context.t2 = _context['catch'](15);
          _didIteratorError = true;
          _iteratorError = _context.t2;

        case 31:
          _context.prev = 31;
          _context.prev = 32;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 34:
          _context.prev = 34;

          if (!_didIteratorError) {
            _context.next = 37;
            break;
          }

          throw _iteratorError;

        case 37:
          return _context.finish(34);

        case 38:
          return _context.finish(31);

        case 39:
          delete tweet.entities.media;

        case 40:
          if (!(path.has(tweet, 'extended_entities.media.length') && tweet.extended_entities.media.length > 0)) {
            _context.next = 70;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 44;
          _iterator2 = tweet.extended_entities.media[Symbol.iterator]();

        case 46:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 55;
            break;
          }

          _m = _step2.value;

          if (media.has(_m.id)) {
            _context.next = 52;
            break;
          }

          _context.next = 51;
          return buildMediaObject(receivedAt, collectId, _m);

        case 51:
          media.add(_m.id);

        case 52:
          _iteratorNormalCompletion2 = true;
          _context.next = 46;
          break;

        case 55:
          _context.next = 61;
          break;

        case 57:
          _context.prev = 57;
          _context.t3 = _context['catch'](44);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t3;

        case 61:
          _context.prev = 61;
          _context.prev = 62;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 64:
          _context.prev = 64;

          if (!_didIteratorError2) {
            _context.next = 67;
            break;
          }

          throw _iteratorError2;

        case 67:
          return _context.finish(64);

        case 68:
          return _context.finish(61);

        case 69:
          delete tweet.extended_entities.media;

        case 70:
          // User
          userId = path.has(tweet, 'user.id') ? tweet.user.id : undefined;

          if (!userId) {
            _context.next = 78;
            break;
          }

          user = tweet.user;

          user = clean('user', user);
          delete tweet.user;
          date = new Date(user.created_at);
          _context.next = 78;
          return {
            meta: {
              version: 1,
              type: 'user',
              createdAt: date.toISOString(),
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { user: user },
            version: 1
          };

        case 78:
          // Location
          bb = void 0;
          hasGeo = path.has(tweet, 'coordinates.coordinates');
          placeId = path.has(tweet, 'place.id') ? tweet.place.id : undefined;

          if (hasGeo) {
            // Point
            bb = tweet['coordinates'];
          }

          if (!placeId) {
            _context.next = 88;
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
          _context.next = 88;
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

        case 88:
          // Tweet
          tweet = clean('tweet', tweet);
          createdAt = tweet.timestamp_ms ? new Date(Number(tweet.timestamp_ms)) : new Date(tweet.created_at).toISOString();
          _context.next = 92;
          return {
            meta: {
              version: 1,
              type: 'tweet',
              receivedAt: receivedAt,
              createdAt: createdAt,
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

        case 92:
          _context.next = 96;
          break;

        case 94:
          _context.next = 96;
          return {
            meta: {
              type: 'other',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { other: tweet },
            version: 1
          };

        case 96:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[15, 27, 31, 39], [32,, 34, 38], [44, 57, 61, 69], [62,, 64, 68]]);
}

module.exports = {
  removeNullOrEmptyFields: removeNullOrEmptyFields,
  clean: clean,
  split: split
};