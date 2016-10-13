'use strict';

import "babel-polyfill";
const traverse = require('traverse');
const clone = require('clone');
const diff = require('deep-diff').diff;
const isSet = require("object-path").has;

function keep_only_fields_with_data(isRemovable, tweet) {
  let tweet0;
  while ( diff(tweet0, tweet) ) {
    tweet0 = clone(tweet);
    tweet = traverse(tweet).forEach(function (x) {
      if ( isRemovable(x) ) { this.remove(); }
    });
  }
  return tweet;
}

function* split(receivedAt, collectId, tweet) {
  if (tweet['id']) {
    const userId = tweet['user']['id']; 
    if (userId) {
      const user = tweet.user;
      delete tweet.user;
      yield({ 
        meta: { 
          version: 1, 
          type: 'user', 
          receivedAt: receivedAt, 
          collectId: collectId, 
        }, 
        data: { user: user },
      });
    }
    let bb; 
    const hasGeo = isSet(tweet, 'coordinates.coordinates'); 
    const placeId = isSet(tweet, 'place.id') ? tweet['place']['id'] : undefined;
    if (hasGeo) {
      bb = tweet['coordinates'];
    }
    if (placeId) {
      const place = tweet.place;
      if (!hasGeo) {
        bb = place.bounding_box;
        // Fermeture du polygone pour l'index
        bb['coordinates'][0].push( bb['coordinates'][0][0] );
      }
      delete tweet.place;
      yield({ 
        meta: { 
          version: 1, 
          type: 'place', 
          receivedAt: receivedAt, 
          collectId: collectId, 
        }, 
        data: { place: place },
      });
    }
    const retweetedId = isSet(tweet, 'retweeted_status.id') ? tweet['retweeted_status']['id'] : undefined; 
    if (retweetedId) {
      split(receivedAt, collectId, tweet['retweeted_status']);
      delete tweet['retweeted_status'];
    }
    const quotedId = isSet(tweet, 'quoted_status.id') ? tweet['quoted_status']['id'] : undefined; 
    if (quotedId) {
      split(receivedAt, collectId, tweet['quoted_status']);
      delete tweet['quoted_status'];
    }
    yield({ 
      meta: { 
        version: 1,
        type: 'tweet',
        receivedAt: receivedAt, 
        collectId: collectId, 
        userId: userId, 
        placeId: placeId,
        retweetedId: retweetedId,
        geo: bb,
      }, 
      data: { tweet: tweet }, 
    });
  } else {
    yield({ 
      meta: { 
        version: 1,
        type: 'other',
        receivedAt: receivedAt, 
        collectId: collectId, 
      }, 
      data: { other: tweet }, 
    });
  }
}

module.exports = { 
  keep_only_fields_with_data,
  split,
};
