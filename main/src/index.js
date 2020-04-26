const {app, BrowserWindow} = require('electron');let win;function createWindow () {
    win = new BrowserWindow({
      width: 600, height: 400,
      /*minWidth:600, minHeight:400, maxWidth: 600, maxHeight: 400,*/
      webPreferences: { // <--- (1) Additional preferences
        nodeIntegration: false,
        webSecurity: false,
        preload: __dirname + '/preload.js' // <--- (2) Preload script
    }});win.loadURL(`http://localhost:3000`); // <--- (3) Loading react
    
  //win.webContents.openDevTools();
  win.on('closed', () => {  
      win = null
    });
  };app.on('ready', createWindow);app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  });