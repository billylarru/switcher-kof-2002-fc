const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require("electron");
const fs = require('fs')
const devtools = require("./devtools");
const path = require('path')
const shell = require('shelljs');
const settings = require('electron-settings')

if (require('electron-squirrel-startup')) return app.quit();

global.win;
global.tray;

if (process.env.NODE_ENV === "development") {
  devtools();
}

app.on("before-quit", () => {
  app.quitting = true
});

app.on("ready", () => {
  const options = {
    width: 400,
    height: 250,
    title: "Hola mundo",
    center: true,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  };
  global.win = new BrowserWindow(options);

  global.win.once("ready-to-show", () => {
    global.win.show();
  });

  global.win.on('close', (event) => {
    if(app.quitting){
      global.win = null
    }else{
      event.preventDefault()
      global.win.hide()
    }
  })

  global.win.on("closed", () => {
    // console.log('cerrado')
    // global.win = null;
    // app.quit();
  });

  global.win.loadURL(`file://${__dirname}/renderer/index.html`)

  let icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Kof 2002 plus', 
      type: 'radio',
      click: () => {
        global.win.webContents.send('menu-plus')
      }
    },
    {
      label: 'Kof 2002 normal', 
      type: 'radio',
      click: () => {
        global.win.webContents.send('menu-normal')
      }
    },
    {
      label: 'Mostrar ventana', 
      type: 'radio',
      click: () => {
        global.win.show()
      }
    },
    {
      label: 'Salir', 
      type: 'radio',
      click: () => {
        //global.win = null;
        app.quit();
      }
    },
  ])
  global.tray = new Tray(icon)
  global.tray.setToolTip('Switcher KOF 2002')
  global.tray.setContextMenu(contextMenu)
  global.tray.on('click', () => {
    global.win.isVisible() ? global.win.hide() : global.win.show()
  })
});

ipcMain.on('open-directory', async (event) => {
  const result = await dialog.showOpenDialog(global.win, {
    title: 'Seleccione la ubicación de los ROMS',
    buttonLabel: 'Abrir ubicación',
    properties: ['openDirectory']
  })

  if(!result.canceled){
    const romsDirectory = result.filePaths[0]
    console.log('main: ', romsDirectory);
    event.sender.send('get-roms-directory', romsDirectory)
  }
})

ipcMain.on('select-rom-plus', async (event, directory) => {
  try {
    await selectROMPlus(directory)
  } catch (error) {
    event.sender.send('rom-selected', 'plus', error.message, null)
  }
})

ipcMain.on('select-rom-normal', async (event, directory) => {
  try {
    await selectROMNormal(directory)
  } catch (error) {
    console.log('error en rom normal: ', error);
    event.sender.send('rom-selected', 'normal', error.message, null)
  }
})

async function selectROMNormal(){
  try {
    const directory = settings.get('directory')
    console.log('esta es la normal');
    const src = path.join(directory, 'kof2002', 'kof2002normal.zip')
  
    const exists = existsFile(src)

    if(exists){
      const dst = path.join(directory, 'kof2002.zip')
      const result = shell.ln('-sf', src, dst)
      if(result.stderr) throw new Error(result.stderr)
    }else{
      //no existe
      throw new Error('No existe el archivo en: ' + src)
    }
  
  } catch (error) {
    throw error
  }
}

async function selectROMPlus(){
  try {
    console.log('esta es la plus');
    const directory = settings.get('directory')
    const src = path.join(directory, 'kof2002', 'kof2002plus.zip')

    const exists = existsFile(src)

    if(exists){
      const dst = path.join(directory, 'kof2002.zip')
      const result = shell.ln('-sf', src, dst)
      if(result.stderr) throw new Error(result.stderr)
    }else{
      throw new Error('No existe el archivo en: ' + src)
    }

  } catch (error) {
    throw error
  }
}

function existsFile(path) {
  return fs.existsSync(path)
}