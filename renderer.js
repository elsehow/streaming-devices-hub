const {ipcRenderer, remote} = require('electron')
const setupScreen = require('./views/setup-screen')
// defaults for our devices (can configure ports on UI)
const devices = [
  // {
  //   driver: './drivers/mindwave',
  //   name: 'neurosky mindwave',
  //   port: '/dev/cu.MindWaveMobile-DevA',
  // },
  // {
  //   driver: './drivers/arduino',
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
setupScreen(devices, function (config) {
  let loggedDataS = require('./log-device')(config)
  loggedDataS.log("this is my data ;0")
  // console.log('renderer sees config', config)
  // // prepare to receive a reply - a stream of logged buffers
  // ipcRenderer.on('logged-buffer-stream', (event, ref) => {
  //   // Now we get a kefir stream of buffers written to the log
  //   console.log('got a stream. logging it....', ref)
  //   let loggedDataS = remote.getCurrentWindow()[ref]
  //   console.log('logged data S')
  //   loggedDataS.log('logged data...')
  // })
  // // send our config to the main process
  // ipcRenderer.send('config', config)
})
