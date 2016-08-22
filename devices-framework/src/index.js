let kefir = require('kefir')
let yo = require('yo-yo')
let identity = (...x) => x

function topLevelView (views) {
  return yo`<div id="app">
    <h1>Device feeds:</h1>
    ${views.map(function (template) {
      return yo`${template}`
    })}
  </div>`
}

function loadingView () {
  return yo`<div id="app">loading...</div>`
}

function fromDevice (id) {
  return function (buffer) {
    return buffer.filter(function (reading) {
      return reading.metadata.id === id
    })
  }
}

let notEmpty = x => x.length>0

module.exports = (loggedDataS, deviceIds, viewFs) => {
  // list of separate views per device
  let viewSs = deviceIds.map((id, i) => {
    let deviceViewF = viewFs[i]
    let deviceDataS = loggedDataS
        .map(fromDevice(id))
        .filter(notEmpty)
    return deviceViewF(deviceDataS)
  })
  // zip into one stream of lists
  let viewS = kefir.combine(viewSs, identity)
  // // TODO combine errors
  // let errorViewS = loggedDataS.mapErrors(err => {
  //   return yo`<strong>${err}</strong>`
  // })
  return viewS.map(topLevelView).toProperty(loadingView)
}
