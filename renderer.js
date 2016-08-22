const {ipcRenderer, remote} = require('electron')
const setupScreen = require('./views/setup-screen')
// defaults for our devices (can configure ports on UI)
const devices = [
  // {
  //   driver: './drivers/neurosky-mindwave',
  //   name: 'neurosky mindwave',
  //   port: '/dev/cu.MindWaveMobile-DevA',
  // },
  // {
  //   driver: './drivers/arduino-gsr',
  //   name: 'skin conductance sensor',
  //   port: '/dev/cu.usbmodem1411',
  // },
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

var config = {
  path: '/tmp/nice',
  name: 'nick',
  devices: devices,
}
let loggedDataS = require('./log-device')(config)
loggedDataS.log("this is my data ;0")

var sp = require('serialport');

sp.list(function(err, ports) {
  console.log(ports);
});
