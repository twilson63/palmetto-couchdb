'use strict'

var EventEmitter = require('events').EventEmitter
var ee = new EventEmitter()
var follow = require('follow')
var request = require('request')

module.exports = function (config) {
  var url = [config.endpoint, config.app].join('/')
  // subscribe
  follow({ db: url, include_docs: true, since: 'now' }, function (err, change) {
    if (change.doc.to) ee.emit(change.doc.to, change.doc)
  })
  // publish
  ee.on('send', function (event) {
    request.put(url, { json: event }, function (e,r) {
      if (e) return console.log(e)
    })
  })
  // return emitter
  return ee
}