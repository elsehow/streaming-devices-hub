var SerialPort = require('serialport');
var gsr = require('..')
var opts = {
  port: '/dev/cu.usbmodem1421',
}

var sensor = gsr(function (err, port) {
  if (err) return console.log(err)
  port.on('data', data => {
    console.log(data, '\n')
  })
})
