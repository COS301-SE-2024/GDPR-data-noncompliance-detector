const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process');
const notifier = require('node-notifier');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const express = require('express');
const os = require('os');
const cors = require('cors');

let apiProcess;

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
  // startAPI();
  startFlaskAPI();
  createWindow();
  // setTimeout(setupWatcher, 100);
  keyHelper();
});

function keyHelper() {
  const app = express();
  const port = 3000;

  // Use CORS middleware
  app.use(cors());

  app.get('/api/encryption-key', (req, res) => {
    const encryptionKey = process.env.GND_ENCRYPTION_KEY;
    res.json({ encryptionKey });
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

function startFlaskAPI() {
  const apiPath = path.join(__dirname, '..', 'backend');
  apiProcess = spawn('python', ['flask_api.py'], { cwd: apiPath });

  apiProcess.stdout.on('data', (data) => {
    console.log(`Flask API stdout: ${data}`);
  });

  apiProcess.stderr.on('data', (data) => {
    console.error(`Flask API stderr: ${data}`);
  });

  apiProcess.on('error', (error) => {
    console.error(`Failed to start Flask API: ${error}`);
  });

  apiProcess.on('close', (code) => {
    console.log(`Flask API process exited with code ${code}`);
  });
}


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

    const fileName = path.basename(output);
    console.log(`Extracted file name: ${fileName}`);

    const parts = fileName.split('.');
    const name = parts[0] + '_report.txt';
    const newFileName = name;

    const outputDir = path.join('../backend/Reports', newFileName);


    axios.post('http://127.0.0.1:8000/new-file', postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log("Alive--------------------------");
      output = JSON.stringify(res.data);
      console.log("Report successfully created")
      const outputDir = path.join('../backend/Reports', newFileName);
        fs.writeFileSync(outputDir, output, 'utf8');
        notifier.notify({
          title: 'GND Notification',
          message: `GND has created a new report`,
          sound: true,
          wait: false,
          icon: 'src/assets/logo.png'
        });
    })
    .catch((error) => {
      console.error(`problem with request: ${error.message}`);
    });
  });
  
}

app.on('before-quit', () => {
  if (apiProcess) {
    apiProcess.kill();
  }

  const homeDir = os.homedir();

  const documentsDir = path.join(homeDir, 'Documents', 'GND', 'uploads');

  fs.readdir(documentsDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      const filePath = path.join(documentsDir, file);
      fs.unlink(filePath, err => {
        if (err) throw err;
      });
    }
  });

});