const {ipcRenderer, remote} = require('electron')
const setupScreen = require('./views/setup-screen')
// defaults for our devices (can configure ports on UI)
const devices = [
  {
    driver: './drivers/neurosky-mindwave',
    name: 'neurosky mindwave',
    port: '/dev/cu.MindWaveMobile-DevA',
  },
  {
    driver: './drivers/arduino-gsr',
    name: 'skin conductance sensor',
    port: '/dev/cu.usbmodem1411',
    // disabled: true,// TODO how to avoid/still view/
  },
  {
    driver: './drivers/timeserver',
    name: 'timeserver',
    port: 'http://indra.webfactional.com/timeserver',
  },
]
// the setup screen calls back on the user's configuration
// setupScreen(devices, function (config) {
//   let loggedDataS = require('./log-device')(config)
//   loggedDataS.log("this is my data ;0")
// })

let config = {
  path: '/tmp/nice',
  name: 'nick',
  devices: devices,
}
config.devices = config.devices.filter(d => !d.disabled)
let loggedDataS = require('./log-devices')(config)
// loggedDataS
//   .map(buff =>
//        buff.map(l =>
//                 l.value.metadata.device))
//   .log("data from device ;0")
let ids = config.devices.map(d => d.name)
let drawFs = config.devices.map(d =>
                         require(d.driver).draw)
var framework = require('./devices-framework')
var elS = framework(loggedDataS, ids, drawFs)
let el = null
const yo = require('yo-yo')
elS.onValue(newEl => {
  if (!el) {
    el = newEl
    document.body.innerHTML = ''
    document.body.appendChild(el)
  }
  // TODO searching dom every update?
  yo.update(document.getElementById('app'), newEl)
})


