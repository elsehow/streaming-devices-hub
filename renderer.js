const {ipcRenderer, remote} = require('electron')
const setupScreen = require('./views/setup-screen')
const framework = require('./devices-framework')
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
    disabled: true,
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
let deviceNames = config.devices.map(d=>d.name)
let drawFs = config.devices.map(d => require(d.driver).draw)
var store = framework(loggedDataS, deviceNames, drawFs)
let el = null
const yo = require('yo-yo')
store.subscribe(state => {
  // console.log('state!', state)
  function errorMsg (err) {
    if (err)
      return yo`<div class="error">
        ${err.toString()}
      </div>`
    return
  }
  function viewDevices (nameStateMap) {
    let names = Object.keys(nameStateMap)
    let views = names.map(name => {
      let view = nameStateMap[name].view
      let display = view ? view : yo`<h2>${name}</h2>`
      return yo`<div>
        ${display}
      </div>`
    })
    return yo`<div>${views}</div>`
  }
  let newEl = yo`<div>
    ${errorMsg(state.error)}
    ${viewDevices(state.nameStateMap)}
  </div>`
  if (!el) {
    el = newEl
    document.body.appendChild(el)
  }
  // document.body.innerHTML = ''
  yo.update(el, newEl)
})
