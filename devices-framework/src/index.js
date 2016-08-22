let kefir = require('kefir')
let yo = require('yo-yo')
let args = (...x) => x

function topLevelView (errorViewS, deviceViewS) {
  return errorViewS
    .combine(deviceViewS, (err, views) => {
      console.log('err?', err)
      return yo`<div id="app">
        ${err}
        <h1>Device feeds:</h1>
        ${views}
      </div>`
    })
}

function loadingView () {
  return yo`<div id="app">loading...</div>`
}

function fromDevice (id) {
  return function (buffer) {
    return buffer.filter(function (reading) {
      return reading.value.metadata.device === id
    })
  }
}

let notEmpty = x => x.length>0

module.exports = (loggedDataS, deviceIds, viewFs) => {
  // list of separate views per device
  // let viewSs = deviceIds.map((id, i) => {
  //   let deviceViewF = viewFs[i]
  //   let deviceDataS = loggedDataS
  //       .ignoreErrors()
  //       .map(fromDevice(id))
  //       .filter(notEmpty)
  //   return deviceViewF(deviceDataS)
  // })
  let errorViewS = loggedDataS
      .ignoreValues()
      .flatMapErrors(err => {
        return kefir.constant(
          yo`<strong>ERR!: ${err.toString()}</strong>`
        )
      })
  let deviceViewS = loggedDataS
      .ignoreErrors()
      .map(vs => {
        return yo`<div>
          ${JSON.stringify(vs)}
        </div>`
      })
  // errorViewS.log('error view s')
  // // combine into one stream of lists
  // let viewS = kefir.combine(viewSs, args)
  // viewS.log('viewS')
  // TODO need to map errors into values....
  return topLevelView(errorViewS, deviceViewS)
    .toProperty(loadingView)
}
