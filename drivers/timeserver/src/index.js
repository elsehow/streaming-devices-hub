var request = require('request');
var timestamp = require('unix-timestamp')
var kefir = require('kefir')
/*
  Takes opts.url
  URL for the timeserver
*/
function timeserver (interval, url) {
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

module.exports = timeserver
