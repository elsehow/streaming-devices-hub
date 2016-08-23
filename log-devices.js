const levelup = require('levelup');
const leveldown = require('leveldown');
const level = path => levelup(path, { db: leveldown })
const hyperlog = require('hyperlog')
const kefir = require('kefir')
// collect sources (kefir streams) in log
// holds for a buffer of ms or buffer length count
function sink (log, sources, ms, cnt) {
  var lastKeys = null
  var stream = kefir.merge(sources)
  function saveToLog (values) {
    return kefir.fromNodeCallback(cb => {
      var docs = values.map(v => {
        return {
          links: lastKeys,
          value: v,
        }
      })
      log.batch(docs, cb)
    })
  }
  var saved = stream
      .bufferWithTimeOrCount(ms,cnt)
      .filter(buff => buff.length>0)
      .flatMap(saveToLog)
  saved.onValue(ns => {
    lastKeys = ns.map(n => n.key)
  })
  return saved
}

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
    let deviceSetupF = require(device.driver).setup
    let deviceDataS = deviceSetupF(device.port)
    // map each stream through the passthrough
    return deviceDataS.map(passthrough)
  }
  let streams = config.devices.filter(d => d.enabled).map(load)
  var loggedDataS = sink(log, streams, 50, 100) // TODO break out into hypersink or s/t
  return loggedDataS
}
