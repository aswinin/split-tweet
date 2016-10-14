'use strict';

var split = require('../lib/index.js').split;
var describe = require('mocha').describe;
var it = require('mocha').it;
var test = require('unit.js');

var createdAt = new Date(1475529595743);
var receivedAt = '2016-10-13T07:59:09.324Z';
var collectId = 10;

describe('split', function () {

  it('decomposes a tweet in a user and a message', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      user: {
        id: 5678,
        login: "toto"
      }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined,
        media: []
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          timestamp_ms: "1475529595743"
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a tweet in a user, a place and a message', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      user: {
        id: 5678,
        login: "toto"
      },
      place: { id: 12, city: true, bounding_box: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92]]] } }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'place',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        place: { id: 12, city: true, bounding_box: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92], [-0.3, 51.92]]] } }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92], [-0.3, 51.92]]] },
        placeId: 12,
        retweetedId: undefined,
        media: []
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          timestamp_ms: "1475529595743"
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a tweet in a user, a point and a message', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      user: {
        id: 5678,
        login: "toto"
      },
      place: { id: 12, city: true, bounding_box: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92]]] } },
      coordinates: {
        type: "Point",
        coordinates: [-47.92, -15.77]
      }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'place',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        place: { id: 12, city: true, bounding_box: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92]]] } }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: { type: "Point", coordinates: [-47.92, -15.77] },
        placeId: 12,
        retweetedId: undefined,
        media: []
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          coordinates: { type: "Point", coordinates: [-47.92, -15.77] },
          timestamp_ms: "1475529595743"
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a non tweet in an other object', function () {

    var input = { blabla: true };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        type: 'other',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: { other: { blabla: true } }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a retweet in a user, a message, another user and another message', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      retweeted_status: {
        id: 4321,
        text: "No",
        timestamp_ms: "1475529594000",
        user: {
          id: 8765,
          login: "lili"
        }
      },
      user: {
        id: 5678,
        login: "toto"
      }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 8765,
          login: "lili"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: new Date("2016-10-03T21:19:54.000Z"),
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 8765,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined,
        media: []
      },
      data: {
        tweet: {
          id: 4321,
          text: "No",
          timestamp_ms: "1475529594000"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: undefined,
        placeId: undefined,
        retweetedId: 4321,
        media: []
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          timestamp_ms: "1475529595743"
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a quote in a user, a message, another user and another message', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      quoted_status: {
        id: 4321,
        text: "No",
        timestamp_ms: "1475529594000",
        user: {
          id: 8765,
          login: "lili"
        }
      },
      user: {
        id: 5678,
        login: "toto"
      }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 8765,
          login: "lili"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: new Date("2016-10-03T21:19:54.000Z"),
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 8765,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined,
        media: []
      },
      data: {
        tweet: {
          id: 4321,
          text: "No",
          timestamp_ms: "1475529594000"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined,
        media: []
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          timestamp_ms: "1475529595743"
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a tweet with media in a user, a message and a media', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      entities: {
        media: [{ id: 100 }]
      },
      user: {
        id: 5678,
        login: "toto"
      }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        type: 'media',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        media: {
          id: 100
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined,
        media: [100]
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          timestamp_ms: "1475529595743",
          entities: {}
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });

  it('decomposes a tweet with many media in a user, a message and many media', function () {

    var input = {
      id: 1234,
      text: "Yes",
      timestamp_ms: "1475529595743",
      entities: {
        media: [{ id: 100 }]
      },
      extended_entities: {
        media: [{ id: 100 }, { id: 200 }]
      },
      user: {
        id: 5678,
        login: "toto"
      }
    };
    var data = split(receivedAt, collectId, input);

    test.object(data.next().value).is({
      version: 1,
      meta: {
        type: 'media',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        media: {
          id: 100
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        type: 'media',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        media: {
          id: 200
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'user',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: {
        user: {
          id: 5678,
          login: "toto"
        }
      }
    });

    test.object(data.next().value).is({
      version: 1,
      meta: {
        version: 1,
        type: 'tweet',
        createdAt: createdAt,
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined,
        media: [100, 200]
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          timestamp_ms: "1475529595743",
          entities: {},
          extended_entities: {}
        }
      }
    });

    test.bool(data.next().done).isTrue;
  });
});