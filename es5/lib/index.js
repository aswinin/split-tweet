'use strict';

require('babel-polyfill');

var _marked = [split].map(regeneratorRuntime.mark);

var traverse = require('traverse');
var clone = require('clone');
var diff = require('deep-diff').diff;
var isSet = require("object-path").has;

function keep_only_fields_with_data(isRemovable, tweet) {
  var tweet0 = void 0;
  while (diff(tweet0, tweet)) {
    tweet0 = clone(tweet);
    tweet = traverse(tweet).forEach(function (x) {
      if (isRemovable(x)) {
        this.remove();
      }
    });
  }
  return tweet;
}

function split(receivedAt, collectId, tweet) {
  var retweetedId, quotedId, media, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, m, userId, user, bb, hasGeo, placeId, place;

  return regeneratorRuntime.wrap(function split$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!tweet.id) {
            _context.next = 59;
            break;
          }

          // Retweet
          retweetedId = isSet(tweet, 'retweeted_status.id') ? tweet.retweeted_status.id : undefined;

          if (!retweetedId) {
            _context.next = 5;
            break;
          }

          return _context.delegateYield(split(receivedAt, collectId, tweet.retweeted_status), 't0', 4);

        case 4:
          delete tweet.retweeted_status;

        case 5:
          // Quoted tweet
          quotedId = isSet(tweet, 'quoted_status.id') ? tweet.quoted_status.id : undefined;

          if (!quotedId) {
            _context.next = 9;
            break;
          }

          return _context.delegateYield(split(receivedAt, collectId, tweet.quoted_status), 't1', 8);

        case 8:
          delete tweet.quoted_status;

        case 9:
          // Media
          media = new Set();

          if (!(isSet(tweet, 'entities.media.length') && tweet.entities.media.length > 0)) {
            _context.next = 39;
            break;
          }

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 14;
          _iterator = tweet.entities.media[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 24;
            break;
          }

          m = _step.value;

          media.add(m.id);
          _context.next = 21;
          return {
            meta: {
              type: 'media',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { media: m },
            version: 1
          };

        case 21:
          _iteratorNormalCompletion = true;
          _context.next = 16;
          break;

        case 24:
          _context.next = 30;
          break;

        case 26:
          _context.prev = 26;
          _context.t2 = _context['catch'](14);
          _didIteratorError = true;
          _iteratorError = _context.t2;

        case 30:
          _context.prev = 30;
          _context.prev = 31;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 33:
          _context.prev = 33;

          if (!_didIteratorError) {
            _context.next = 36;
            break;
          }

          throw _iteratorError;

        case 36:
          return _context.finish(33);

        case 37:
          return _context.finish(30);

        case 38:
          delete tweet.entities.media;

        case 39:
          // User
          userId = isSet(tweet, 'user.id') ? tweet.user.id : undefined;

          if (!userId) {
            _context.next = 45;
            break;
          }

          user = tweet.user;

          delete tweet.user;
          _context.next = 45;
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

        case 45:
          // Location
          bb = void 0;
          hasGeo = isSet(tweet, 'coordinates.coordinates');
          placeId = isSet(tweet, 'place.id') ? tweet.place.id : undefined;

          if (hasGeo) {
            // Point
            bb = tweet['coordinates'];
          }

          if (!placeId) {
            _context.next = 55;
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
          _context.next = 55;
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

        case 55:
          _context.next = 57;
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

        case 57:
          _context.next = 61;
          break;

        case 59:
          _context.next = 61;
          return {
            meta: {
              type: 'other',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { other: tweet },
            version: 1
          };

        case 61:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[14, 26, 30, 38], [31,, 33, 37]]);
}

module.exports = {
  keep_only_fields_with_data: keep_only_fields_with_data,
  split: split
};