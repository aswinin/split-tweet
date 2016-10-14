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
  var userId, user, bb, hasGeo, placeId, place, retweetedId, quotedId;
  return regeneratorRuntime.wrap(function split$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!tweet['id']) {
            _context.next = 25;
            break;
          }

          userId = tweet['user']['id'];

          if (!userId) {
            _context.next = 7;
            break;
          }

          user = tweet.user;

          delete tweet.user;
          _context.next = 7;
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

        case 7:
          bb = void 0;
          hasGeo = isSet(tweet, 'coordinates.coordinates');
          placeId = isSet(tweet, 'place.id') ? tweet['place']['id'] : undefined;

          if (hasGeo) {
            bb = tweet['coordinates'];
          }

          if (!placeId) {
            _context.next = 17;
            break;
          }

          place = tweet.place;

          if (!hasGeo) {
            bb = place.bounding_box;
            // Fermeture du polygone pour l'index
            bb['coordinates'][0].push(bb['coordinates'][0][0]);
          }
          delete tweet.place;
          _context.next = 17;
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

        case 17:
          retweetedId = isSet(tweet, 'retweeted_status.id') ? tweet['retweeted_status']['id'] : undefined;

          if (retweetedId) {
            split(receivedAt, collectId, tweet['retweeted_status']);
            delete tweet['retweeted_status'];
          }
          quotedId = isSet(tweet, 'quoted_status.id') ? tweet['quoted_status']['id'] : undefined;

          if (quotedId) {
            split(receivedAt, collectId, tweet['quoted_status']);
            delete tweet['quoted_status'];
          }
          _context.next = 23;
          return {
            meta: {
              version: 1,
              type: 'tweet',
              receivedAt: receivedAt,
              createdAt: new Date(Number(tweet['timestamp_ms'])),
              collectId: collectId,
              userId: userId,
              placeId: placeId,
              retweetedId: retweetedId,
              geo: bb
            },
            data: { tweet: tweet },
            version: 1
          };

        case 23:
          _context.next = 27;
          break;

        case 25:
          _context.next = 27;
          return {
            meta: {
              type: 'other',
              receivedAt: receivedAt,
              collectId: collectId
            },
            data: { other: tweet },
            version: 1
          };

        case 27:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

module.exports = {
  keep_only_fields_with_data: keep_only_fields_with_data,
  split: split
};