const kefir = require('kefir')
const yo = require('yo-yo')
const args = (...x) => x
const notEmpty = x => x.length>0
const zipObject = require('zip-object');
const createStore = require('minidux').createStore
function fromDevice (id) {
  return function (buffer) {
    return buffer.filter(function (reading) {
      return reading.value.metadata.device === id
    })
  }
}

// returns a redux store
module.exports = (loggedDataS, deviceNames, drawFs) => {

  let deviceInitialStates = deviceNames.map(name => {
    return {
      name: name,
      view: null
    }
  })
  let nameStateMap = zipObject(deviceNames, deviceInitialStates)
  let nameDrawFMap = zipObject(deviceNames, drawFs)
  let initialState = {
    error: null,
    nameStateMap: nameStateMap,
  }

  function reducer (state, action) {
    switch (action.type) {
    case 'error':
      state.error=action.error
      return state
    case 'device':
      state.nameStateMap[action.name] = {
        name: action.name,
        view: action.view
      }
      return state
    default:
      return state
    }
  }

  let store = createStore(reducer, initialState)

  loggedDataS.onError(err => {
    store.dispatch({
      type: 'error',
      error: err
    })
  })

  deviceNames.map(name => {
    let deviceDataS = loggedDataS
        .ignoreErrors()
        .map(fromDevice(name))
        .flatten()
    let viewS = nameDrawFMap[name](deviceDataS)
    viewS.onValue(el => {
      store.dispatch({
        type: 'device',
        name: name,
        view: el
      })
    })
  })
  return store
}
