// let win; // Declare win at the top of the file

// const {app, BrowserWindow} = require('electron');
// const url = require('url');
// const path = require('path');

// // Require electron-reload and pass the directory to watch
// require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });

// function onReady () {
//     win = new BrowserWindow({width: 900, height: 600}) // Adjust the height
//     win.loadURL(url.format({
//         pathname: path.join(
//             __dirname,
//             'dist/gnd-app/index.html'),
//         protocol: 'file:',
//         slashes: true
//     }))
// }

// app.on('ready', onReady);
const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  win.loadFile('dist/gnd-app/index.html')
}

app.whenReady().then(createWindow)
