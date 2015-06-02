'use strict'

var test = require('tap').test
var rewire = require('rewire')
var palmetto = rewire('../')

test('publish', function (t) {
  palmetto.__set__('request', {
    post: function (url, options, cb) { }
  })

  palmetto.__set__('follow', function (options, cb) {
    setTimeout(function() {
      cb(null, {
        doc: {
          to: 'widget/response/create',
          object: {
            ok: true
          }
        }
      })
    }, 0)
  })

  var ee = palmetto({
    endpoint: 'http://admin:admin@localhost:5984/tinylog',
    app: 'foo'
  })
  
  ee.on('widget/response/create', function (result) {
    t.ok(result.object.ok, 'notified was a success')
    t.end()
  })
})