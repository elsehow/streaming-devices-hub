const yo = require('yo-yo')
const createStore = require('minidux').createStore
const {dialog} = require('electron').remote

function setupScreen (devicesDefaults, optsCb) {

  function pathSelectDialog (cb) {
    return dialog.showOpenDialog({
      properties: ['openDirectory']
    }, cb)
  }

  let initialState = {
    path: null,
    name: null,
    devices: devicesDefaults,
  }

  function reducer (state, action) {
    switch (action.type) {
    case 'path':
      state.path = action.path
      return state
    case 'device-port':
      state.devices = state.devices.map(device => {
        if (device.name === action.device)
          device.port = action.port
        return device
      })
      return state
    case 'name-change':
      state.name = action.name
      return state
    default:
      return state
    }
  }

  function view (state) {
    // async method calls back on selected paths
    function selectLogPath () {
      pathSelectDialog(function (path) {
        store.dispatch( {
          type: 'path',
          path: path[0],
        })
      })
    }
    function deviceConfig (device) {
      return yo`<div>
        <h3>${device.name}</h3>
        <input onchange=${function (ev) {
          store.dispatch({
            type: 'device-port',
            device: device,
            port: ev.target.value,
          })
        }} value=${device.port}/>
        </div>`
    }
    let readyToRecord = state.name && state.path
    return yo`<div>
      <div>
      <p>
      <button onclick=${selectLogPath}>
      Select a path for the log
    </button>
      <br>
      <i>${state.path ? state.path : 'Select a path'}</i>
      </p>
      <p>
      <input onchange=${function (ev) {
        store.dispatch({
          type: 'name-change',
          name: ev.target.value,
        })
      }} placeholder="your name"/>
      </p>
      </div>
      <div>
      <h2>Devices</h2>
      ${state.devices.map(deviceConfig)}
    </div>
      <div>
        <button onclick=${function () {
          optsCb(state)
        }} disabled=${!readyToRecord}>
        START RECORDING!
        </button>
      </div>
      </div>`
  }

  var el = view(initialState)
  var store = createStore(reducer, initialState)
  store.subscribe(function (state) {
    var newEl = view(state)
    yo.update(el, newEl)
  })
  document.body.innerHTML = ''
  document.body.appendChild(el)
}

module.exports = setupScreen
