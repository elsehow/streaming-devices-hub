// each of these methods takes a port (or url)
// and returns a kefir stream of values
module.exports = {
  timeserver: function (url) {
    return require('timeserver')(500, url)
  },
  mindwave: function (port) {
    return require('neurosky-mindwave')(port)
  },
  arduino: function (port) {
    return require('arduino-gsr')(port)
  },
}
