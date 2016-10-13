'use strict';

var split = require('../lib/index.js').split;
var describe = require('mocha').describe;
var it = require('mocha').it;
var test = require('unit.js');

describe('split', function () {

  it('decomposes a tweet in a user and a message', function () {
    var receivedAt = '2016-10-13T07:59:09.324Z';
    var collectId = 10;
    var input = {
      id: 1234,
      text: "Yes",
      user: {
        id: 5678,
        login: "toto"
      }
    };
    var data = split(receivedAt, collectId, input);
    test.object(data.next().value).is({
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
      meta: {
        version: 1,
        type: 'tweet',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: undefined,
        placeId: undefined,
        retweetedId: undefined
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes"
        }
      }
    });
    test.bool(data.next().done).isTrue;
  });

  it('decomposes a tweet in a user, a place and a message', function () {
    var receivedAt = '2016-10-13T07:59:09.324Z';
    var collectId = 10;
    var input = {
      id: 1234,
      text: "Yes",
      user: {
        id: 5678,
        login: "toto"
      },
      place: { id: 12, city: true, bounding_box: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92]]] } }
    };
    var data = split(receivedAt, collectId, input);
    test.object(data.next().value).is({
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
      meta: {
        version: 1,
        type: 'tweet',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: { type: "Polygon", coordinates: [[[-0.3, 51.92], [-0.3, 51.97], [-0.24, 51.97], [-0.24, 51.92], [-0.3, 51.92]]] },
        placeId: 12,
        retweetedId: undefined
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes"
        }
      }
    });
    test.bool(data.next().done).isTrue;
  });

  it('decomposes a tweet in a user, a point and a message', function () {
    var receivedAt = '2016-10-13T07:59:09.324Z';
    var collectId = 10;
    var input = {
      id: 1234,
      text: "Yes",
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
      meta: {
        version: 1,
        type: 'tweet',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10,
        userId: 5678,
        geo: { type: "Point", coordinates: [-47.92, -15.77] },
        placeId: 12,
        retweetedId: undefined
      },
      data: {
        tweet: {
          id: 1234,
          text: "Yes",
          coordinates: { type: "Point", coordinates: [-47.92, -15.77] }
        }
      }
    });
    test.bool(data.next().done).isTrue;
  });

  it('decomposes a non tweet in an other object', function () {
    var receivedAt = '2016-10-13T07:59:09.324Z';
    var collectId = 10;
    var input = { blabla: true };
    var data = split(receivedAt, collectId, input);
    test.object(data.next().value).is({
      meta: {
        version: 1,
        type: 'other',
        receivedAt: "2016-10-13T07:59:09.324Z",
        collectId: 10
      },
      data: { other: { blabla: true } }
    });
    test.bool(data.next().done).isTrue;
  });
});