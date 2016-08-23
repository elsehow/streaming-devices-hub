const yo = require('yo-yo')
const createStore = require('minidux').createStore
const {dialog} = require('electron').remote
const serialport = require('serialport')

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
    portsList: [],
  }

  function reducer (state, action) {
    switch (action.type) {
    case 'device-enabled':
      state.devices = state.devices.map(device => {
        if (device.name === action.device)
          device.enabled = action.enabled
        return device
      })
      return state
    case 'ports-list':
      state.portsList = action.portsList
      return state
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

  serialport.list(function (err, ports) {
    if (err)
      throw err
    if (ports.length) {
      store.dispatch({
        type: 'ports-list',
        portsList: ports,
      })
    }
  })

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
          device: device.name,
          port: ev.target.value,
        })
      }} value=${device.port}/>
      <input type="checkbox"
    checked=${device.enabled}
    onchange=${function (ev) {
        store.dispatch({
          type: 'device-enabled',
          device: device.name,
          enabled: ev.target.checked,
        })
      }}/>
      </div>`
  }

  function ports (portsList){
    if (!portsList.length)
      return
    return yo`<ul>
      ${portsList.map(function (port) {
        return yo`<li>${port.comName}</li`
      })}
    </ul>`
  }

  function view (state) {

    let readyToRecord = state.name && state.path

    return yo`<div>

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

      <div>
        <h2>Devices</h2>
      Serial ports I can see, FYI (not all of them will be open):
        ${ports(state.portsList)}
        ${state.devices.map(deviceConfig)}
      </div>

      <p>
        <button onclick=${function () {
          optsCb(state)
        }} disabled=${!readyToRecord}>
        START RECORDING!
        </button>
      </p>

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
