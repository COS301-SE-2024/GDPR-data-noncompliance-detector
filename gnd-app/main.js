const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  win.loadFile('dist/gnd-app/index.html')
}

app.whenReady().then(createWindow)
