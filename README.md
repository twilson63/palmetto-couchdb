# palmetto couchdb adapter

An adapter to use couchdb as the append only log in palmetto flow

[![Build Status](https://travis-ci.org/twilson63/palmetto-couchdb.svg?branch=master)](https://travis-ci.org/twilson63/palmetto-couchdb)

## Usage

The palmetto flow adapter allows both the client and service to keep their code abstracted to the the pub/sub implementation so that the pub/sub implementations can be swapped out and not affect the service or client, they both have to to point to the same pub/sub service inorder to work, but this gives great flexibility in changing out components or parts of the application with different technologies.

Client Example:

``` js
var palmetto = require('palmetto-couchdb')
var ee = palmetto({
  endpoint: 'http://localhost:5984',
  app: 'app_log'
})

app.get('/foo', function (req, res) {
  ee.once('1234', function (e) {
    // handle response
    res.writeHead(200, { 'content-type': 'application/json'})
    res.end(e.object)
  })  
  ee.emit('send', {
    to: '/domain/service/action',
    from: '1234',
    subject: 'service',
    verb: 'action',
    object: req.params,
    dateSubmitted: moment().utc().format()
  })
})
```

Service Example:

// container

``` js
require('health-server')
var palmetto = require('palmetto-couchdb')
var ee = palmetto({
  endpoint: 'http://localhost:5984',
  app: 'app_log'
})

svc(ee)
```

// service

``` js
module.exports = function (ee) {
  ee.on('/domain/service/action', function (e) {
    // validate e.object using json-schema
    // do serivce stuff
    ee.emit('send', {
      to: e.from,
      from: '/domain/service/action',
      subject: e.subject + '-response',
      verb: e.verb + '-response',
      object: result,
      ...
    })
  })
}

[see tests]

## Test

```
npm test
```


More docs coming soon.