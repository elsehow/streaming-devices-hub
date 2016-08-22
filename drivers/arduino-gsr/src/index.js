var SerialPort = require('serialport');
var kefir = require('kefir')
function open (portName, cb) {
  var port = new SerialPort(portName, {
    parser: SerialPort.parsers.readline(',\n')
  })
  port.on('error', err => {
    cb(err, null)
  })
  port.on('open', function (err) {
    cb(err, port)
  })
}
// returns a stream
function setup (portName) {
  let portS = kefir.fromNodeCallback(cb => open(portName, cb))
  let dataS = portS.flatMap(port => kefir.fromEvents(port, 'data'))
  let errorS = portS.flatMap(port => {
    return kefir.stream(emitter => {
      port.on('error', emitter.error)
    })
  })
  return dataS.merge(errorS)
}

var yo = require('yo-yo')
function draw (stream) {
  return stream.map(v => {
    return yo`<div>
      <h2>Mindwave!</h2>
      ${JSON.stringify(v)}
    </div>
      `
  })
}

module.exports = {
  setup: setup,
  draw: draw,
}
