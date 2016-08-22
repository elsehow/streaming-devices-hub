const {ipcRenderer} = require('electron')
const setupScreen = require('./views/setup-screen')
// the setup screen calls back on the user's configuration
setupScreen(function (config) {
  // prepare to receive a reply - a stream of logged buffers
  ipcRenderer.on('logged-buffer-stream', (event, stream) => {
    // TODO Now we get a kefir stream of buffers written to the log
    console.log('my stream', stream)
  })
  // send our config to the main process
  ipcRenderer.send('config', config)
})
