const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')
const path = require('path')

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

app.whenReady().then(() => {
  createWindow();
  
  const pythonScriptPath = path.join(__dirname, '..', 'backend', 'File_monitor', 'file_watcher.py');
  const directoryToMonitor = 'C:/Users/Mervyn Rangasamy/Documents/Receiver';
  const extensionsToMonitor = 'pdf,docx,xls,xlsx';

  const watcher = spawn('python', [pythonScriptPath, directoryToMonitor, extensionsToMonitor]);

  watcher.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`stdout: ${output}`);
    try {
      const jsonData = JSON.parse(output);
      if (jsonData.type && jsonData.path) {
        console.log(`File ${jsonData.type}: ${jsonData.path}`);
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  });

  watcher.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  watcher.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
