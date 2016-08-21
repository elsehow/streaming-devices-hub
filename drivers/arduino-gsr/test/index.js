var gsr = require('..')
var port = '/dev/cu.usbmodem1411'
var sensor = gsr(port)
sensor.log('yo')

// var empty = x => x.length==0
// var kefir = require('kefir')
// // calls back on (err, list-of-arduino-ports)
// function findArduinos (cb) {
//   SerialPort.list(function (err, ports) {
//     if (err) return console.log(err)
//     // console.log(ports)
//     var arduinoPorts = ports
//         .map(p => p.comName)
//         .filter(port => !port.search('/dev/cu.usbmodem'))
//     if (!empty(arduinoPorts))
//       return cb(null, arduinoPorts)
//     return cb('No arduinos found!', null)
//   })
// }
// // TODO try each port name in sequence?
// function choosePort (names) {
//   return names[0]
// }
