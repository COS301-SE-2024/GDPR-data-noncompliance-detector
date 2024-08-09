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