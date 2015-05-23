'use strict'

var test = require('tap').test
var pc = require('../')

var ee = pc({
  endpoint: 'http://admin:admin@localhost:5984/tinylog',
  since: 'now',
  subscription: {
    subject: ['widget'],
    verb: ['*'],
    type: ['response']
  }
})

test('publish', function (t) {
  ee.on('widget/response/create', function (result) {
    t.ok(result.ok)
    t.end()
  })
  ee.emit('send', {
    subject: 'widget',
    verb: 'create', 
    type: 'request',
    object: {
      name: 'Widget1'
    }
  })
})