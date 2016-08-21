var SerialPort = require('serialport');
var gsr = require('..')
var opts = {
  port: '/dev/cu.usbmodem1421',
}

var sensor = gsr()
sensor.log('yo')
