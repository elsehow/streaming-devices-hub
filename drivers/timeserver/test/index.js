var timeserver = require('..')
var timeStream = timeserver(500, {
  url: 'http://indra.webfactional.com/timeserver',
})
timeStream.log('timeserver stream')
