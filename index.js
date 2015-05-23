var EventEmitter = require('events').EventEmitter
var ee = new EventEmitter()
var follow = require('follow')
var request = require('request')
var R = require('ramda')

module.exports = function (config) {
  follow({
    db: config.endpoint, 
    include_docs: true, 
    filter: function (doc, req) {
      function valid (array, value) {
        if (array[0] === '*') return true
        return array.indexOf(value) > -1
      }
      return valid(config.subscription.subject, doc.subject) &&
        valid(config.subscription.verb, doc.verb) &&
        valid(config.subscription.type, doc.type)
    },
    since: config.since}, function (err, change) {
      //console.log(change.doc)
      // STORE Change ID
      ee.emit([
        change.doc.subject, 
        change.doc.type, 
        change.doc.verb].join('/'), 
        change.doc)
    })

  ee.on('send', function (event) {
    var id = [event.subject, event.type, event.verb, (new Date()).toISOString()].join('-')
    var uri = [config.endpoint, id].join('/')
    request.put(uri, { json: event }).pipe(process.stdout)
  })
  return ee
}