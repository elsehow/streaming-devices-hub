var SerialPort = require('serialport');
var kefir = require('kefir')
function open (portName, cb) {
  var port = new SerialPort(portName, {
    parser: SerialPort.parsers.readline(',\n')
  })
  port.on('open', function (err) {
    cb(err, port)
  })
}
// returns a stream
module.exports = function (portName) {
  return kefir
    .fromNodeCallback(cb => open(portName, cb))
    .flatMap(port => kefir.fromEvents(port, 'data'))
}
