const electronDebug = require('electron-debug')

module.exports = function devtools(){
  electronDebug({ showDevTools: true})
}