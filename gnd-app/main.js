const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 600,
    icon: path.join(__dirname, 'src/assets/logo.ico'),
    webPreferences: {
      nodeIntegration: true,
    }
  })
  win.setMenu(null);
  win.loadFile(path.join(__dirname, 'dist', 'gnd-app', 'index.html'))
}

app.whenReady().then(() => {
  startAPI();
  createWindow();
  setTimeout(setupWatcher, 100);
});

function startAPI() {
  const apiPath = path.join(__dirname, '..', 'backend');
  const api = spawn('uvicorn', ['api:app', '--reload'], {cwd: apiPath});

  api.stdout.on('data', (data) => {
    console.log(`API stdout: ${data}`);
  });

  api.stderr.on('data', (data) => {
    console.error(`API stderr: ${data}`);
  });

  api.on('error', (error) => {
    console.error(`Failed to start API: ${error}`);
  });

  api.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function getReceiverPath() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['get_absolute_path.py']);
    
    pythonProcess.stdout.on('data', (data) => {
      resolve(data.toString().trim());
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
}

function setupWatcher() {

  // const receiver_path = getReceiverPath();
  const watcher = spawn('python', ['../backend/File_monitor/file_watcher.py', '../backend/Receiver', 'pdf,docx,xlsx,xls']);

  watcher.stdout.on('data', (data) => {
    let output = data.toString().trim();
    console.log(`Watcher stdout: ${output}`);
    const postData = { path: output };

    const segments = output.split(path.sep);
    const fileNameWithExtension = segments[segments.length - 1];
    const parts = fileNameWithExtension.split('.');
    const name = parts[0] + '_report.txt';
    const extension = parts.slice(1).join('.');
    console.log("Crashing");
    const newFileName = extension ? `${name}` : name;
    axios.post('http://127.0.0.1:8000/new-file', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log("Alive--------------------------");
      output = JSON.stringify(res.data);
      console.log("Report successfully created")
      const outputDir = path_.join('../backend/Reports', newFileName);
      fs.writeFileSync(outputDir, output, 'utf8');
    })
    .catch((error) => {
      console.error(`problem with request: ${error.message}`);
    });
  });
  
}