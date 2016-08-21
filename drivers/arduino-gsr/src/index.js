var SerialPort = require('serialport');
var empty = x => x.length==0
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
module.exports = function (cb) {
  findArduinos(function (err, portNames) {
    if (err) return cb(err)
    // TODO try each port name in sequence?
    var portName = portNames[0]
    var port = new SerialPort(portName, {
      parser: SerialPort.parsers.readline(',\n')
    }, function (err) {
      cb(err, port)
    })
  })
}
