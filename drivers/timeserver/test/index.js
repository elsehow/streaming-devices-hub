var timeserver = require('..')
var timeStream = timeserver(
'http://indra.webfactional.com/timeserver'
)
timeStream.log('timeserver stream')
