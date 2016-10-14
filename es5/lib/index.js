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
  var retweetedId, quotedId, media, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, m, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _m, userId, user, bb, hasGeo, placeId, place;

  return regeneratorRuntime.wrap(function split$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!tweet.id) {
            _context.next = 89;
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
          _context.next = 20;
          return {
            meta: {
              type: 'media',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { media: m },
            version: 1
          };

        case 20:
          media.add(m.id);

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
          if (!(isSet(tweet, 'extended_entities.media.length') && tweet.extended_entities.media.length > 0)) {
            _context.next = 69;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 43;
          _iterator2 = tweet.extended_entities.media[Symbol.iterator]();

        case 45:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 54;
            break;
          }

          _m = _step2.value;

          if (media.has(_m.id)) {
            _context.next = 51;
            break;
          }

          _context.next = 50;
          return {
            meta: {
              type: 'media',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { media: _m },
            version: 1
          };

        case 50:
          media.add(_m.id);

        case 51:
          _iteratorNormalCompletion2 = true;
          _context.next = 45;
          break;

        case 54:
          _context.next = 60;
          break;

        case 56:
          _context.prev = 56;
          _context.t3 = _context['catch'](43);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t3;

        case 60:
          _context.prev = 60;
          _context.prev = 61;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 63:
          _context.prev = 63;

          if (!_didIteratorError2) {
            _context.next = 66;
            break;
          }

          throw _iteratorError2;

        case 66:
          return _context.finish(63);

        case 67:
          return _context.finish(60);

        case 68:
          delete tweet.extended_entities.media;

        case 69:
          // User
          userId = isSet(tweet, 'user.id') ? tweet.user.id : undefined;

          if (!userId) {
            _context.next = 75;
            break;
          }

          user = tweet.user;

          delete tweet.user;
          _context.next = 75;
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

        case 75:
          // Location
          bb = void 0;
          hasGeo = isSet(tweet, 'coordinates.coordinates');
          placeId = isSet(tweet, 'place.id') ? tweet.place.id : undefined;

          if (hasGeo) {
            // Point
            bb = tweet['coordinates'];
          }

          if (!placeId) {
            _context.next = 85;
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
          _context.next = 85;
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

        case 85:
          _context.next = 87;
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

        case 87:
          _context.next = 91;
          break;

        case 89:
          _context.next = 91;
          return {
            meta: {
              type: 'other',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { other: tweet },
            version: 1
          };

        case 91:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[14, 26, 30, 38], [31,, 33, 37], [43, 56, 60, 68], [61,, 63, 67]]);
}

module.exports = {
  keep_only_fields_with_data: keep_only_fields_with_data,
  split: split
};