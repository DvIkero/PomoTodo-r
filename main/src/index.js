const {app, BrowserWindow} = require('electron');let win;function createWindow () {
    win = new BrowserWindow({
      width: 650, height: 600,
      minWidth: 650, minHeight: 600,
      /*minWidth:600, minHeight:400, maxWidth: 600, maxHeight: 400,*/
      webPreferences: { // <--- (1) Additional preferences
        nodeIntegration: false,
        webSecurity: false,
        preload: __dirname + '/preload.js' // <--- (2) Preload script
    }});
 
  win.loadURL(`http://localhost:3000`); 
  /* ^ Loading react 
  if you are ready to build this program, put built react file under main/src and change it to
  win.loadURL(`file://${__dirname}/build/index.html`);
  */

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