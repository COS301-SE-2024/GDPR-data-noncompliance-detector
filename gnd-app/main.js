// const { app, BrowserWindow } = require('electron')
// const { spawn } = require('child_process');
// const http = require('http');
// const axios = require('axios');
// const path_ = require('path');
// const fs = require('fs');
//
// function createWindow () {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     minWidth: 700,
//     minHeight: 600,
//     webPreferences: {
//       nodeIntegration: true,
//     }
//   })
//
//   win.loadFile('dist/gnd-app/index.html')
// }
//
// app.whenReady().then(() => {
//   startAPI();
//   createWindow();
//   setTimeout(setupWatcher, 10000);
// });
//
// function startAPI() {
//   const api = spawn('uvicorn', ['api:app', '--reload'], {cwd: '../backend'});
//   api.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
//
//   api.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
//
//   api.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
//   });
// }
//
// function setupWatcher() {
//   const watcher = spawn('python', ['../backend/File_monitor/file_watcher.py', '../backend/Receiver', 'pdf,docx,xlsx,xls']);
//
//   watcher.stdout.on('data', (data) => {
//     let output = data.toString().trim();
//     console.log(`stdout: ${output}`);
//     const postData = { path: output };
//
//     const path = data.toString().trim();
//     const segments = path.split('/');
//     const fileNameWithExtension = segments[segments.length - 1];
//     const parts = fileNameWithExtension.split('.');
//     const name = parts[0] + '_report.txt';
//     const extension = parts.slice(1).join('.');
//     console.log("Crashing");
//     const newFileName = extension ? `${name}` : name;
//     axios.post('http://127.0.0.1:8000/new-file', postData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => {
//         console.log("Alive--------------------------");
//       output = JSON.stringify(res.data);
//       console.log("Report successfully created")
//       const outputDir = path_.join('C:/Users/User/Documents/Academics/2024/COS 301 SOFTWARE ENGINEERING/AprilFour/GDPR-data-noncompliance-detector/backend/Reports', newFileName);
//       fs.writeFileSync(outputDir, output, 'utf8');
//     })
//     .catch((error) => {
//       console.error(`problem with request: ${error.message}`);
//     });
//   });
//
// }
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
  setTimeout(setupWatcher, 1000);  // Increased delay to ensure API is ready
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
    console.log(`API process exited with code ${code}`);
  });
}

function setupWatcher() {
  const watcherPath = path.join(__dirname, '..', 'backend', 'File_monitor', 'file_watcher.py');
  const receiverPath = path.join(__dirname, '..', 'backend', 'Receiver');
  const watcher = spawn('python', [watcherPath, receiverPath, 'pdf,docx,xlsx,xls']);

  watcher.stdout.on('data', (data) => {
    let output = data.toString().trim();
    console.log(`Watcher stdout: ${output}`);
    const postData = { path: output };

    const segments = output.split(path.sep);
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
        console.log("Report successfully created");
        const outputDir = path.join(__dirname, '..', 'backend', 'Reports', newFileName);
        fs.writeFile(outputDir, JSON.stringify(res.data), 'utf8', (err) => {
          if (err) console.error(`Failed to write report: ${err}`);
        });
      })
      .catch((error) => {
        console.error(`Problem with request: ${error.message}`);
      });
  });

  watcher.stderr.on('data', (data) => {
    console.error(`Watcher stderr: ${data}`);
  });

  watcher.on('error', (error) => {
    console.error(`Failed to start watcher: ${error}`);
  });

  watcher.on('close', (code) => {
    console.log(`Watcher process exited with code ${code}`);
  });
}
