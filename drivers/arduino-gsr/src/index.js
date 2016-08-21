var SerialPort = require('serialport');
var empty = x => x.length==0
var kefir = require('kefir')
// calls back on (err, list-of-arduino-ports)
function findArduinos (cb) {
  SerialPort.list(function (err, ports) {
    if (err) return console.log(err)
    // console.log(ports)
    var arduinoPorts = ports
        .map(p => p.comName)
        .filter(port => !port.search('/dev/cu.usbmodem'))
    if (!empty(arduinoPorts))
      return cb(null, arduinoPorts)
    return cb('No arduinos found!', null)
  })
}
// TODO try each port name in sequence?
function choosePort (names) {
  return names[0]
}
function open (portName, cb) {
  var port = new SerialPort(portName, {
    parser: SerialPort.parsers.readline(',\n')
  }) 
  port.on('open', function (err) {
    cb(err, port)
  })
}
// returns a stream
module.exports = function () {
  return kefir
    .fromNodeCallback(findArduinos)
    .map(choosePort)
    .flatMap(function (port) {
      return kefir.fromNodeCallback(cb => {
        return open(port, cb)
      })
    })
    .flatMap(port => {
      return kefir.fromEvents(port, 'data')
    })
}
