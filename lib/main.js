const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('ready', () => {
  console.log('The application is ready');

  mainWindow = new BrowserWindow();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
