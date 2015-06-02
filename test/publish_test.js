'use strict'

var test = require('tap').test
var rewire = require('rewire')
var palmetto = rewire('../')

test('publish', function (t) {
  palmetto.__set__('request', {
    post: function (url, options, cb) {
      t.deepEquals(options.json, {
        to: 'widget/create',
        from: 'me',
        subject: 'widget',
        verb: 'create', 
        type: 'request',
        object: {
          name: 'Widget1'
        }
      }, 'event posted')
    }
  })
  palmetto.__set__('follow', function () {} )

  var ee = palmetto({
    endpoint: 'http://admin:admin@localhost:5984/tinylog',
    app: 'foo'
  })

  ee.emit('send', {
    to: 'widget/create',
    from: 'me',
    subject: 'widget',
    verb: 'create', 
    type: 'request',
    object: {
      name: 'Widget1'
    }
  })
  t.end()
})

