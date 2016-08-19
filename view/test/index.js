const ud = require('ud')
const kefir = require('kefir')
const yo = require('yo-yo')
// everything in this function will get updated on change
var setup = ud.defn(module, function (state) {
  var myLoggedDataS = kefir.fromPoll(500, () => {
    return [
      {
        metadata: 'clock',
        value: Date.now(),
      },
      {
        metadata: 'name',
        value: 'nick',
      }
    ]
  })
  function myCoolViewF (loggedS) {
    let isClock = v => v.metadata === 'clock'
    let notEmpty = vs => vs.length > 0
    // process/filter stream
    let timeS = loggedS
        .map(vs => vs.filter(isClock))
        .filter(notEmpty)
        .map(vs => vs[0])
        .map(time => time.value)
    // turn stream into yo templates
    return timeS.map(time => {
      return yo`<div>
        <h3>heres the time</h3>
        <strong>${time}</strong>
        </div>`
    })
  }
  let viewer = require('..')
  let yoTemplateS = viewer(myLoggedDataS, myCoolViewF)
  let el = null
  yoTemplateS.onValue(newEl => {
    if (!el) {
      el = newEl
      document.body.innerHTML = ''
      document.body.appendChild(el)
    }
    yo.update(document.getElementById('app'), newEl) // mutates el?
  })
  return
})
// will re-run setup() whenever method changes
setup()
