var request = require('request');
var timestamp = require('unix-timestamp')
var kefir = require('kefir')
// HACK magic number
var interval = 500
/*
  Takes opts.url
  URL for the timeserver
*/
function timeserver (url) {
  function timeStream () {
    var requestedAt = Date.now()
    return kefir.stream(function (emitter) {
      request(url, function (error, response, body) {
        if (error)
          emitter.error(error)
        else if (response.statusCode !== 200)
          emitter.error(response.statusCode)
        else
          emitter.emit({
            requestedAt: requestedAt,
            serverTime: timestamp.fromDate(body)*1000,
          })
      })
    })
  }
  return kefir.interval(interval,1).flatMap(timeStream)
}

var yo = require('yo-yo')
function draw (stream) {
  return stream.map(v => {
    return yo`<div>
      <h2>Timeserver</h2>
      ${JSON.stringify(v)}
      </div>
      `
  })
}

module.exports = {
  setup: timeserver,
  draw: draw,
}
