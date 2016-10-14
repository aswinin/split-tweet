'use strict';

import "babel-polyfill";
const traverse = require('traverse');
const clone = require('clone');
const diff = require('deep-diff').diff;
const isSet = require("object-path").has;

function isRemovableFieldWithValue(x) {
  return x === null 
      || x === undefined 
      || x === '' 
      || ( Array.isArray(x) && x.length === 0 ) 
      || ( typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0 )
  ;
}

function keep_only_fields_with_data(tweet) {
  let tweet0;
  while ( diff(tweet0, tweet) ) {
    tweet0 = clone(tweet);
    tweet = traverse(tweet).forEach(function (x) {
      if ( isRemovableFieldWithValue(x) ) { this.remove(); }
    });
  }
  return tweet;
}

function* split(receivedAt, collectId, tweet) {
  if (tweet.id) {
    // Retweet
    const retweetedId = isSet(tweet, 'retweeted_status.id') ? tweet.retweeted_status.id : undefined; 
    if (retweetedId) {
      yield* split(receivedAt, collectId, tweet.retweeted_status);
      delete tweet.retweeted_status;
    }
    // Quoted tweet
    const quotedId = isSet(tweet, 'quoted_status.id') ? tweet.quoted_status.id : undefined; 
    if (quotedId) {
      yield* split(receivedAt, collectId, tweet.quoted_status);
      delete tweet.quoted_status;
    }
    // Media
    let media = new Set();
    if (isSet(tweet, 'entities.media.length') && tweet.entities.media.length > 0) {
      for (let m of tweet.entities.media) {
        yield {
          meta: { 
            type: 'media', 
            receivedAt: receivedAt, 
            collectId: collectId, 
          }, 
          data: { media: m },
          version: 1,
        };
        media.add(m.id);
      }
      delete tweet.entities.media;
    }
    if (isSet(tweet, 'extended_entities.media.length') && tweet.extended_entities.media.length > 0) {
      for (let m of tweet.extended_entities.media) {
        if (!media.has(m.id)) {
          yield {
            meta: { 
              type: 'media', 
              receivedAt: receivedAt, 
              collectId: collectId, 
            }, 
            data: { media: m },
            version: 1,
          };
          media.add(m.id);
        }
      }
      delete tweet.extended_entities.media;
    }
    // User
    const userId = isSet(tweet, 'user.id') ? tweet.user.id : undefined; 
    if (userId) {
      const user = tweet.user;
      delete tweet.user;
      yield { 
        meta: { 
          version: 1, 
          type: 'user', 
          receivedAt: receivedAt, 
          collectId: collectId, 
        }, 
        data: { user: user },
        version: 1,
      };
    }
    // Location
    let bb; 
    const hasGeo = isSet(tweet, 'coordinates.coordinates'); 
    const placeId = isSet(tweet, 'place.id') ? tweet.place.id : undefined;
    if (hasGeo) {
      // Point
      bb = tweet['coordinates'];
    }
    if (placeId) {
      const place = tweet.place;
      if (!hasGeo) {
        bb = place.bounding_box;
        // Fermeture du polygone pour l'index
        bb.coordinates[0].push( bb.coordinates[0][0] );
      }
      delete tweet.place;
      // Place
      yield { 
        meta: { 
          version: 1, 
          type: 'place', 
          receivedAt: receivedAt, 
          collectId: collectId, 
        }, 
        data: { place: place },
        version: 1,
      };
    }
    // Tweet
    yield { 
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
        media: Array.from(media),
      }, 
      data: { tweet: tweet }, 
      version: 1,
    };
  } else {
    // Other
    yield { 
      meta: { 
        type: 'other',
        receivedAt: receivedAt, 
        collectId: collectId, 
      }, 
      data: { other: tweet }, 
      version: 1,
    };
  }
}

module.exports = { 
  keep_only_fields_with_data,
  split,
};
