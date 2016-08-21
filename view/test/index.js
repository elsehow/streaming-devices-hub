const ud = require('ud')
const kefir = require('kefir')
const yo = require('yo-yo')
// everything in this function will get updated on change
let setup = ud.defn(module, function (state) {

  // setup a device
  function device (offset=0) {

    let id = `clock + ${offset}`

    function setup () {
      let myStream = kefir.fromPoll(500, () => {
        return {
          metadata: {
            id: id
          },
          payload: {
            time: `${Date.now()} + ${offset}`,
          },
        }
      })
      return myStream
    }

    // return a stream of yo template strings
    function draw (readingsS) {
      // turn stream into yo templates
      return readingsS.map(readings => {
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


  function elementStream (devices) {
    let loggedDataS = kefir.zip(devices.map(d => d.setup()))
    let drawFs = devices.map(d => d.draw)
    let deviceIds = devices.map(d => d.id)
    let elS = viewer(loggedDataS,
                     deviceIds,
                     drawFs)
    return elS
  }

  // set up view
  let viewer = require('..')
  // simulate multiple devices
  let devices = [
    // two devices produce slightly diff data
    device(),
    device('WOW'),
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
