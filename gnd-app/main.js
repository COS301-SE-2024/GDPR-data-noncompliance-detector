const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process');
const http = require('http');
const axios = require('axios');
const path_ = require('path');
const fs = require('fs');

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
  startAPI();
  createWindow();
  setTimeout(setupWatcher, 1);
});

function startAPI() {
  const api = spawn('uvicorn', ['api:app', '--reload'], {cwd: '../backend'});
  api.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  api.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  api.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function setupWatcher() {
  const watcher = spawn('python', ['../backend/File_monitor/file_watcher.py', '../backend/Receiver', 'pdf,docx,xlsx,xls']);

  watcher.stdout.on('data', (data) => {
    let output = data.toString().trim();
    console.log(`stdout: ${output}`);
    const postData = { path: output };

    const path = data.toString().trim();
    const segments = path.split('/');
    const fileNameWithExtension = segments[segments.length - 1];
    const parts = fileNameWithExtension.split('.');
    const name = parts[0] + '_report.txt';
    const extension = parts.slice(1).join('.');
    const newFileName = extension ? `${name}` : name;

    axios.post('http://127.0.0.1:8000/new-file', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      // console.log(`STATUS: ${res.status}`);
      // console.log(`BODY: ${JSON.stringify(res.data)}`);
      output = JSON.stringify(res.data);
      // console.log(output)
      console.log("Report successfully created")
      const outputDir = path_.join('../backend/Reports', newFileName);
      fs.writeFileSync(outputDir, output, 'utf8');
    })
    .catch((error) => {
      console.error(`problem with request: ${error.message}`);
    });
  });
}