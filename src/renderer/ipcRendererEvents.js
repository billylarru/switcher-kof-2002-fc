const { ipcRenderer } = require('electron')
const settings = require('electron-settings')

function setIpc(){
  if(settings.has('directory')){
    console.log('ya se guardó el directory roms')
    const directory = settings.get('directory')
    console.log('ipc directorio:', directory);
    setTextBox(directory)
  }

  ipcRenderer.on('get-roms-directory', (event, romsDirectory) => {
    console.log('front ', romsDirectory);

    if(romsDirectory.includes('ROMs')){
      settings.set('directory', romsDirectory)
      setTextBox(romsDirectory)
    }else{
      window.alert('Esta no es la carpeta correcta\n\nDebes seleccionar la carpeta ROMs de donde se encuentra instalado Fightcade')
    }

    console.log(settings.file('directory'));
  })

  ipcRenderer.on('rom-selected', (event, version, error, data) => {
    if(!error){
      console.log('no hay error')
    }else{
      if(error.includes('ln: EPERM')){
        window.alert('Para poder cambiar el ROM este programa tiene que ser ejecutado como administrador')
        return
      }

      if(version === 'normal'){
        window.alert('Debe crear una carpeta con el nombre kof2002 dentro de la carpeta ROMs\n\n Luego dentro de kof2002 colocar la rom de la normal con el nombre kof2002normal.zip')
      }else if(version === 'plus'){
        window.alert('Debe crear una carpeta con el nombre kof2002 dentro de la carpeta ROMs\n\n Luego dentro de kof2002 colocar la rom de la plus con el nombre kof2002plus.zip')
      }
    }
  })

  ipcRenderer.on('menu-normal', (event) => {
    selectROMNormal()
  })

  ipcRenderer.on('menu-plus', (event) => {
    selectROMPlus()
  })
}

function setTextBox(directory){
  const $txt = document.getElementById('txtROMS')
  $txt.value = directory
}

function openDirectory(){
  ipcRenderer.send('open-directory')
}

function selectROMNormal(){
  if(settings.has('directory')){
    ipcRenderer.send('select-rom-normal')
  }else{
    window.alert('Por favor indica la ubicación de la carpeta ROMs de Fightcade')
  }
}

function selectROMPlus(){
  if(settings.has('directory')){
    ipcRenderer.send('select-rom-plus')
  }else{
    window.alert('Por favor indica la ubicación de la carpeta ROMs de Fightcade')
  }
}

module.exports = {
  setIpc,
  openDirectory,
  selectROMNormal,
  selectROMPlus
}