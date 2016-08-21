const ud = require('ud')
const kefir = require('kefir')
const yo = require('yo-yo')
// everything in this function will get updated on change
let setup = ud.defn(module, function (state) {

  // setup a device
  function device (offset=0) {

    let id = `clock + ${offset}`

    function setup () {
      let myStream = kefir.fromPoll(1000+offset, () => {
        return {
          metadata: {
            id: id
          },
          payload: {
            time: Date.now()
          },
        }
      })
      return myStream
    }

    // return a stream of yo template strings
    function draw (readingsS) {
      // each value in the stream is a list
      // of 0 or more readings from this device
      return readingsS.map(readings => {
        // some yo template to retrun
        return yo`<div>
          <h3>heres the time for ${id}</h3>
          <strong>${readings[0].payload.time}</strong>
        </div>`
      })
    }

    return {
      setup: setup,
      draw: draw,
      id: id,
    }
  }


  // returns a stream of top-level view elements
  function elementStream (devices) {
    // simulate logged data stream 
    // which will be buffers (ie. a list)
    let loggedDataS = kefir
        .merge(devices.map(d => d.setup()))
        .map(r => [ r ])
    // get all the drawFs from our devces
    let drawFs = devices.map(d => d.draw)
    // all the ids of our devices
    let deviceIds = devices.map(d => d.id)
    // return a stream of elements with devices lists
    let elS = viewer(loggedDataS, deviceIds, drawFs)
    return elS
  }

  // set up view
  let viewer = require('..')
  // simulate multiple devices
  let devices = [
    // two devices produce slightly diff data
    device(),
    device(250),
  ]
  let yoTemplateS = elementStream(devices)
  let el = null
  yoTemplateS.onValue(newEl => {
    if (!el) {
      el = newEl
      document.body.innerHTML = ''
      document.body.appendChild(el)
    }
    // TODO searching dom every update?
    yo.update(document.getElementById('app'), newEl)
  })
  return
})
// will re-run setup() whenever method changes
setup()
