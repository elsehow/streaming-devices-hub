const levelup = require('levelup');
const leveldown = require('leveldown');
const level = path => levelup(path, { db: leveldown })
const hyperlog = require('hyperlog')
const cycular = require('cycular')
// returns a stream of buffers that have been saved to a hyperlog
module.exports = function log (config) {
  console.log('setting up', config)
  // set up a hyperlog
  let db = level(config.path)
  let log = hyperlog(db, {
    valueEncoding:'json'
  })
  // set up devices streams
  function load (device) {
    console.log('loading', device)
    function passthrough (value) {
      return {
        metadata: {
          person: config.name,
          device: device.name,
          timestamp: Date.now(), // TODO monotonic timestamp?
        },
        payload: value,
      }
    }
    // drivers are methods that take a port and return a stream
    let deviceSetupF = require(device.driver)
    let deviceDataS = deviceSetupF(device.port)
    // map each stream through the passthrough
    return deviceDataS.map(passthrough)
  }
  let streams = config.devices.map(load)
  var loggedDataS   = cycular.store(log, streams, 50, 100) // TODO break out into hypersink or s/t
  return loggedDataS
}

