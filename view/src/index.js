let kefir = require('kefir')
let yo = require('yo-yo')
module.exports = (loggedDataS, ...viewFs) => {
  // stream of lists of template strings
  let devicesViews = viewFs.map(viewF => viewF(loggedDataS))
  let devicesViewsS = kefir.zip(devicesViews)
  // // TODO combine error view
  // let errorViewS = loggedDataS.mapErrors(err => {
  //   return yo`<strong>${err}</strong>`
  // })
  return devicesViewsS.map(views => {
    return yo`<div id="app">
      <h1>Device feeds:</h1>
      ${views.map(function (template) {
        return yo`${template}`
      })}
    </div>`
  }).toProperty(() => {
      return yo`<div id="app">loading...</div>`
    })
}
