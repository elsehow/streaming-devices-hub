const {ipcRenderer, remote} = require('electron')
const setupScreen = require('./views/setup-screen')
const framework = require('./devices-framework')
// defaults for our devices (can configure ports on UI)
const devices = [
  {
    driver: './drivers/neurosky-mindwave',
    name: 'neurosky mindwave',
    port: '/dev/cu.MindWaveMobile-DevA',
    enabled: true,
  },
  {
    driver: './drivers/arduino-gsr',
    name: 'skin conductance sensor',
    port: '/dev/cu.usbmodem1411',
    enabled: false,
  },
  {
    driver: './drivers/timeserver',
    name: 'timeserver',
    port: 'http://indra.webfactional.com/timeserver',
    enabled: true,
  },
]
function setup (config) {
  document.body.innerHTML = 'loading..'
  config.devices = config.devices.filter(d => d.enabled)
  let loggedDataS = require('./log-devices')(config)
  let deviceNames = config.devices.map(d=>d.name)
  let drawFs = config.devices.map(d => require(d.driver).draw)
  var store = framework(loggedDataS, deviceNames, drawFs)
  loggedDataS.log('hmm')
  store.subscribe(require('./views/devices-screen'))

}
// the setup screen calls back on the user's configuration
setupScreen(devices, function (config) {
  setup(config)
})
// DEBUG
// let config = {
//   path: '/tmp/nice',
//   name: 'nick',
//   devices: devices,
// }
// setup(config)
