'use strict';

import "babel-polyfill";
const traverse = require('traverse');
const clone = require('clone');
const diff = require('deep-diff').diff;
const path = require("object-path");

const redundantFields = {
  tweet: [
    'id_str',
    'in_reply_to_status_id_str',
    'in_reply_to_user_id_str',
    'quoted_status_id_str',
    'geo',
  ],
  user: [
    'id_str',
    'profile_background_image_url_https',
    'profile_image_url_https',
  ],
  media: [
    'id_str',
    'media_url_https',
  ],
};

const unecessaryFields = {
  tweet: [],
  user: [
    'profile_background_color',
    'profile_background_tile',
    'profile_link_color',
    'profile_sidebar_border_color',
    'profile_sidebar_fill_color',
    'profile_text_color',
  ],
  media: [
    'display_url',
    'expanded_url',
    'sizes',
  ],
}; 


function isNullOrEmpty(x) {
  return x === null 
      || x === undefined 
      || x === '' 
      || ( Array.isArray(x) && x.length === 0 ) 
      || ( typeof x === 'object' && Object.getOwnPropertyNames(x).length === 0 )
  ;
}

function removeNullOrEmptyFields(tweet) {
  let tweet0;
  while ( diff(tweet0, tweet) ) {
    tweet0 = clone(tweet);
    tweet = traverse(tweet).forEach(function (x) {
      if ( isNullOrEmpty(x) ) { this.remove(); }
    });
  }
  return tweet;
}

function clean(type, object) {
  redundantFields[type].forEach( (x) => path.del(object, x) );
  unecessaryFields[type].forEach( (x) => path.del(object, x) );
  return removeNullOrEmptyFields(object);
}

function buildMediaObject(receivedAt, collectId, m) {
  m = clean('media', m);
  return {
    meta: { 
      type: 'media', 
      receivedAt: receivedAt, 
      collectId: collectId, 
    }, 
    data: { media: m },
    version: 1,
  };
}

function* split(receivedAt, collectId, tweet) {
  if (tweet.id) {
    // Remove redundant fiels
    tweet = clean('tweet', tweet);
    // Retweet
    const retweetedId = path.has(tweet, 'retweeted_status.id') ? tweet.retweeted_status.id : undefined; 
    if (retweetedId) {
      yield* split(receivedAt, collectId, tweet.retweeted_status);
      delete tweet.retweeted_status;
    }
    // Quoted tweet
    const quotedId = path.has(tweet, 'quoted_status.id') ? tweet.quoted_status.id : undefined; 
    if (quotedId) {
      yield* split(receivedAt, collectId, tweet.quoted_status);
      delete tweet.quoted_status;
    }
    // Media
    let media = new Set();
    if (path.has(tweet, 'entities.media.length') && tweet.entities.media.length > 0) {
      for (let m of tweet.entities.media) {
        yield buildMediaObject(receivedAt, collectId, m);
        media.add(m.id);
      }
      delete tweet.entities.media;
    }
    if (path.has(tweet, 'extended_entities.media.length') && tweet.extended_entities.media.length > 0) {
      for (let m of tweet.extended_entities.media) {
        if (!media.has(m.id)) {
          yield buildMediaObject(receivedAt, collectId, m);
          media.add(m.id);
        }
      }
      delete tweet.extended_entities.media;
    }
    // User
    const userId = path.has(tweet, 'user.id') ? tweet.user.id : undefined; 
    if (userId) {
      let user = tweet.user;
      user = clean('user', user);
      delete tweet.user;
      const date = new Date(user.created_at);
      yield { 
        meta: { 
          version: 1, 
          type: 'user',
          createdAt: date.toISOString(),
          receivedAt: receivedAt, 
          collectId: collectId, 
        }, 
        data: { user: user },
        version: 1,
      };
    }
    // Location
    let bb; 
    const hasGeo = path.has(tweet, 'coordinates.coordinates'); 
    const placeId = path.has(tweet, 'place.id') ? tweet.place.id : undefined;
    if (hasGeo) {
      // Point
      bb = tweet['coordinates'];
    }
    if (placeId) {
      const place = tweet.place;
      if (!hasGeo) {
        bb = clone(place.bounding_box);
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
    tweet = clean('tweet', tweet);
    const createdAt = tweet.timestamp_ms ? new Date(Number(tweet.timestamp_ms)) : (new Date(tweet.created_at)).toISOString();
    yield { 
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
  removeNullOrEmptyFields,
  clean,
  split,
};
